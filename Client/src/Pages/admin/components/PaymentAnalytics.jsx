import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PaymentAnalytics = ({ analytics }) => {
    if (!analytics) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: 'Total Revenue',
            value: `$${analytics.totalRevenue?.toLocaleString() || 0}`,
            subtitle: `${analytics.completedPayments || 0} completed`,
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            borderColor: 'border-green-200',
        },
        {
            title: 'Pending Payments',
            value: `$${analytics.pendingAmount?.toLocaleString() || 0}`,
            subtitle: `${analytics.pendingPayments || 0} pending`,
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600',
            borderColor: 'border-yellow-200',
        },
        {
            title: 'Failed Payments',
            value: `$${analytics.failedAmount?.toLocaleString() || 0}`,
            subtitle: `${analytics.failedPayments || 0} failed`,
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
            borderColor: 'border-red-200',
        },
        {
            title: 'Refunded',
            value: `$${analytics.refundedAmount?.toLocaleString() || 0}`,
            subtitle: `${analytics.refundedPayments || 0} refunded`,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            borderColor: 'border-purple-200',
        },
    ];

    // Prepare chart data
    const chartData = {
        labels: analytics.revenueTrend?.map(item => item.period) || [],
        datasets: [
            {
                label: 'Revenue',
                data: analytics.revenueTrend?.map(item => item.revenue) || [],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Revenue: $${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '$' + value.toLocaleString();
                    }
                }
            }
        }
    };

    return (
        <>
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`${card.bgColor} ${card.borderColor} rounded-lg shadow-sm border p-6 transition-all hover:shadow-md`}
                    >
                        <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
                        <p className={`text-3xl font-bold ${card.textColor} mb-1`}>{card.value}</p>
                        <p className="text-xs text-gray-500">{card.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Trend Chart */}
            {analytics.revenueTrend && analytics.revenueTrend.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <div className="h-80">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            )}
        </>
    );
};

export default PaymentAnalytics;
