import React, { useState } from 'react';
import { useGetAllProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../../../redux/apis/productApis';
import { useGetAllCategoriesQuery } from '../../../redux/apis/categoryApis';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import { toast } from 'react-toastify';

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // API hooks
  const { data: productsData, isLoading, refetch } = useGetAllProductsQuery({
    search: searchTerm,
    category: filterCategory === 'all' ? undefined : filterCategory,
  });
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [deletingProductId, setDeletingProductId] = useState(null);

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeletingProductId(productId);
      try {
        await deleteProduct(productId).unwrap();
        toast.success('Product deleted successfully');
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete product');
      } finally {
        setDeletingProductId(null);
      }
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, formData });
        toast.success('Product updated successfully');
      } else {
        await createProduct(formData);
        toast.success('Product created successfully');
      }
      setShowForm(false);
      setEditingProduct(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save product');
    }
  };

  const categoryOptions = ['all', ...categories.map(cat => cat.title)];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header + Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Products Management</h1>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
          onClick={handleAddProduct}
        >
          <span>+</span> Add Product
        </button>
      </div>

      {/* Search and Categories */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center flex-wrap">
        <div className="flex-1 max-w-md w-full">
        <input
  type="text"
  placeholder="Search products..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="
    w-full rounded-lg px-4 py-2
    border border-gray-300
    outline-none
    transition-all duration-200
    hover:border-red-500
    focus:border-red-600
    focus:ring-2 focus:ring-red-500
  "
/>

        </div>

        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          {categoryOptions.map(category => {
            const isActive = category === filterCategory;
            return (
              <button
  key={category}
  className={`px-4 py-2 rounded-lg text-sm font-medium
    transition-all duration-200
    ${
      isActive
        ? 'bg-red-600 text-white'
        : 'bg-gray-200 text-black hover:ring-2 hover:ring-red-500 hover:bg-transparent'
    }`}
  onClick={() => setFilterCategory(category)}
>
  {category === 'all' ? 'All Categories' : category}
</button>

            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={{
              ...product,
              id: product._id,
              title: product.name,
              image: product.images[0]?.url,
            }}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            isDeleting={deletingProductId === product._id}
          />
        ))}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct ? {
            ...editingProduct,
            title: editingProduct.name,
            image: editingProduct.images?.[0]?.url,
          } : null}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          isLoading={isCreating || isUpdating}
        />
      )}
    </div>
  );
};

export default Products;
