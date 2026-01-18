import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave, onCancel, isLoading = false }) =>
{
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    is_flash_sale: false,
    is_featured: false,
    flash_sale_price: '',
    images: [],
    existingImages: []
  });

  const categories = [
    { id: 1, name: "Sun Glasses" },
    { id: 2, name: "Prescription" },
    { id: 3, name: "Reading" },
    { id: 4, name: "Contact Lenses" },
    { id: 5, name: "Kids Glasses" },
    { id: 6, name: "Sports" }
  ];

  useEffect(() =>
  {
    if (product)
    {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        is_flash_sale: product.is_flash_sale || false,
        is_featured: product?.is_featured || false,
        flash_sale_price: product.flash_sale_price || '',
        images: [], // New images to upload
        existingImages: product.images || [] // Existing images
      });
    }
  }, [product]);

  const handleChange = (e) =>
  {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Add basic fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('stock', formData.stock);

    // Add featured and flash sale fields
    formDataToSend.append('is_featured', formData.is_featured);
    formDataToSend.append('is_flash_sale', formData.is_flash_sale);
    if (formData.is_flash_sale && formData.flash_sale_price) {
      formDataToSend.append('flash_sale_price', formData.flash_sale_price);
    }

    // Add existing images (for edit mode)
    if (formData.existingImages && formData.existingImages.length > 0) {
      formDataToSend.append('existingImages', JSON.stringify(formData.existingImages));
    }

    // Add new image files
    formData.images.forEach((file) => {
      formDataToSend.append('images', file);
    });

    onSave(formDataToSend);
  };

  const inputClass = `
    w-full p-2 border border-gray-400 text-black rounded
    outline-none
    hover:border-red-500
    focus:border-red-600 focus:ring-2 focus:ring-red-500
  `;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200">

        {/* HEADER */}
        <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 m-0">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={onCancel}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Product Name */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <label htmlFor="name" className="text-lg font-semibold text-gray-800">
                Product Name *
              </label>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name..."
              className={`${inputClass} text-lg py-3 px-4 rounded-lg`}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <label className="text-lg font-semibold text-gray-800">
                Product Description *
              </label>
            </div>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product in detail..."
              className={`${inputClass} text-lg py-3 px-4 rounded-lg resize-none`}
              required
            />
          </div>

          {/* Price */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <label htmlFor="price" className="text-lg font-semibold text-gray-800">
                Price *
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">$</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className={`${inputClass} text-lg py-3 pl-8 pr-4 rounded-lg`}
                required
              />
            </div>
          </div>

          {/* Product Options */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">Product Options</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Featured Product */}
              <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData?.is_featured}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    is_featured: e.target.checked
                  }))}
                  className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="is_featured" className="ml-3 flex items-center cursor-pointer">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                </label>
              </div>

              {/* Flash Sale */}
              <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                <input
                  type="checkbox"
                  id="is_flash_sale"
                  name="is_flash_sale"
                  checked={formData.is_flash_sale}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    is_flash_sale: e.target.checked
                  }))}
                  className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="is_flash_sale" className="ml-3 flex items-center cursor-pointer">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Flash Sale</span>
                </label>
              </div>
            </div>
          </div>

          {/* Flash Sale Price */}
          {formData.is_flash_sale && (
            <div className="bg-red-50 rounded-xl p-6 border border-red-100 animate-fade-in">
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <label htmlFor="flash_sale_price" className="text-lg font-semibold text-gray-800">
                  Flash Sale Price *
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">$</span>
                <input
                  type="number"
                  id="flash_sale_price"
                  name="flash_sale_price"
                  value={formData.flash_sale_price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max={formData.price}
                  placeholder="0.00"
                  className={`${inputClass} text-lg py-3 pl-8 pr-4 rounded-lg border-red-300 focus:border-red-500 focus:ring-red-500`}
                  required={formData.is_flash_sale}
                />
              </div>
              <p className="text-sm text-red-600 mt-2">Must be less than regular price (${formData.price || '0.00'})</p>
            </div>
          )}

          {/* Category */}
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <label htmlFor="category" className="text-lg font-semibold text-gray-800">
                Product Category *
              </label>
            </div>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`${inputClass} text-lg py-3 px-4 rounded-lg appearance-none cursor-pointer`}
                required
              >
                <option value="">Choose a category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* STOCK */}
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <label className="text-lg font-semibold text-gray-800">
                Stock Quantity *
              </label>
            </div>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter quantity..."
              min="0"
              className={`${inputClass} text-lg py-3 px-4 rounded-lg`}
              required
            />
          </div>

          {/* Existing Images (for edit mode) */}
          {formData.existingImages && formData.existingImages.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Current Images</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.existingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                      onClick={() => removeExistingImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {formData.existingImages && formData.existingImages.length > 0 ? 'Add More Images' : 'Product Images *'}
                </h3>
                <p className="text-sm text-gray-600">Upload high-quality images of your product</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required={!product || (formData.existingImages && formData.existingImages.length === 0)}
                />
                <div className="border-2 border-dashed border-teal-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors bg-white">
                  <svg className="w-12 h-12 text-teal-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-medium text-gray-700 mb-1">Click to upload images</p>
                  <p className="text-sm text-gray-500">or drag and drop files here</p>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </div>
              <p className="text-sm text-teal-600 font-medium">You can select multiple images</p>

              {/* Preview new images */}
              {formData.images && formData.images.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">New Images to Upload ({formData.images.length})</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-teal-200"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200 bg-gray-50 -m-8 px-8 py-6 rounded-b-2xl">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-8 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {product ? 'Updating...' : 'Adding...'}
                </span>
              ) : product ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Update Product
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </span>
              )}
            </button>
          </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductForm;
