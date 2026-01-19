import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    useGetAllPaymentsQuery,
    useGetPaymentAnalyticsQuery,
    useUpdatePaymentStatusMutation,
} from '../../../redux/apis/paymentApis';
import PaymentAnalytics from '../components/PaymentAnalytics';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

const Payments = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [period, setPeriod] = useState('monthly');

    // Fetch data
    const { data: paymentsData, isLoading, refetch } = useGetAllPaymentsQuery({
        page,
        limit,
        search,
        status: statusFilter,
        startDate,
        endDate,
    });

    const { data: analyticsData } = useGetPaymentAnalyticsQuery({ period });
    const [updateStatus] = useUpdatePaymentStatusMutation();

    const payments = paymentsData?.data || [];
    const pagination = paymentsData?.pagination || {};

    // Handle status update
    const handleStatusUpdate = async (paymentId, newStatus) => {
        try {
            await updateStatus({ id: paymentId, status: newStatus }).unwrap();
            toast.success('Payment status updated successfully');
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update status');
        }
    };

    // Table columns
    const columns = useMemo(
        () => [
            {
                accessorKey: 'order._id',
                header: 'Order ID',
                cell: ({ row }) => (
                    <span className="font-mono text-sm">
                        {row.original.order?._id?.slice(-8) || 'N/A'}
                    </span>
                ),
            },
            {
                accessorKey: 'intentId',
                header: 'Intent ID',
                cell: ({ getValue }) => (
                    <span className="font-mono text-sm">
                        {getValue()?.slice(0, 20) || 'N/A'}...
                    </span>
                ),
            },
            {
                accessorKey: 'order.customer.name',
                header: 'Customer',
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium text-gray-900">
                            {row.original.order?.customer?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                            {row.original.order?.customer?.email || ''}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'totalAmount',
                header: 'Amount',
                cell: ({ getValue }) => (
                    <span className="font-semibold text-green-600">
                        ${getValue()?.toLocaleString() || 0}
                    </span>
                ),
            },
            {
                accessorKey: 'createdAt',
                header: 'Date',
                cell: ({ getValue }) => (
                    <span className="text-sm text-gray-600">
                        {new Date(getValue()).toLocaleDateString()}
                    </span>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.original.status;
                    const statusColors = {
                        pending: 'bg-yellow-100 text-yellow-800',
                        paid: 'bg-green-100 text-green-800',
                        failed: 'bg-red-100 text-red-800',
                        refunded: 'bg-purple-100 text-purple-800',
                    };

                    return (
                        <select
                            value={status}
                            onChange={(e) => handleStatusUpdate(row.original._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]} border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500`}
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    );
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: payments,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    // Export to PDF
    const exportToPDF = () => {
        try {
            const doc = new jsPDF();

            // Add title
            doc.setFontSize(18);
            doc.setTextColor(220, 38, 38); // Red color
            doc.text('Payment Records', 14, 22);

            // Add date range if filtered
            doc.setFontSize(10);
            doc.setTextColor(100);
            if (startDate || endDate) {
                doc.text(`Date Range: ${startDate || 'Start'} to ${endDate || 'End'}`, 14, 30);
            }

            // Prepare table data
            const tableData = payments.map(payment => [
                payment.order?._id?.slice(-8) || 'N/A',
                payment.intentId?.slice(0, 20) || 'N/A',
                payment.order?.customer?.name || 'N/A',
                payment.order?.customer?.email || 'N/A',
                `$${payment.totalAmount?.toLocaleString() || 0}`,
                new Date(payment.createdAt).toLocaleDateString(),
                payment.status.toUpperCase(),
            ]);

            // Add table using autoTable
            autoTable(doc, {
                startY: startDate || endDate ? 35 : 30,
                head: [['Order ID', 'Intent ID', 'Customer', 'Email', 'Amount', 'Date', 'Status']],
                body: tableData,
                theme: 'striped',
                headStyles: {
                    fillColor: [220, 38, 38],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                },
                styles: {
                    fontSize: 8,
                    cellPadding: 3,
                },
                columnStyles: {
                    4: { halign: 'right' },
                    6: { fontStyle: 'bold' },
                },
            });

            // Add footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.getWidth() / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
                doc.text(
                    `Generated on ${new Date().toLocaleString()}`,
                    14,
                    doc.internal.pageSize.getHeight() - 10
                );
            }

            doc.save(`payments-${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('PDF exported successfully');
        } catch (error) {
            console.error('PDF Export Error:', error);
            toast.error('Failed to export PDF. Please try again.');
        }
    };

    // Prepare CSV data
    const csvData = useMemo(() => {
        return payments.map(payment => ({
            'Order ID': payment.order?._id || 'N/A',
            'Intent ID': payment.intentId || 'N/A',
            'Customer Name': payment.order?.customer?.name || 'N/A',
            'Customer Email': payment.order?.customer?.email || 'N/A',
            'Customer Phone': payment.order?.customer?.phone || 'N/A',
            'Amount': payment.totalAmount || 0,
            'Date': new Date(payment.createdAt).toLocaleString(),
            'Status': payment.status,
        }));
    }, [payments]);

    if (isLoading && !payments.length) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Payments Management</h1>
                <p className="mt-2 text-gray-600">Track and manage all payment transactions</p>
            </div>

            {/* Analytics */}
            <PaymentAnalytics analytics={analyticsData?.data} />

            {/* Period Selector for Chart */}
            <div className="mb-6 flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Chart Period:</label>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <option value="daily">Daily (7 days)</option>
                    <option value="weekly">Weekly (12 weeks)</option>
                    <option value="monthly">Monthly (12 months)</option>
                </select>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <input
                            type="text"
                            placeholder="Search by customer, order ID, or intent ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={exportToPDF}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export PDF
                    </button>
                    <CSVLink
                        data={csvData}
                        filename={`payments-${new Date().toISOString().split('T')[0]}.csv`}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                        onClick={() => toast.success('CSV exported successfully')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export CSV
                    </CSVLink>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() && (
                                                    <span>{header.column.getIsSorted() === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                            Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalPayments} total)
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={!pagination.hasPrev}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={!pagination.hasNext}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Empty State */}
            {!isLoading && payments.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search criteria</p>
                </div>
            )}
        </div>
    );
};

export default Payments;
