import React from 'react';

const ProductCard = ({ product, onEdit, onDelete, isDeleting = false }) => {
  // Handle both API data structure and form data structure
  const displayName = product.name || product.title;
  const displayPrice = product.price;
  const displayCategory = product.category;
  const displayStock = product.stock;
  const displayImages = product.images;
  const displayDescription = product.description;

  // Get the first image URL
  let imageUrl = '';
  if (Array.isArray(displayImages) && displayImages.length > 0) {
    if (typeof displayImages[0] === 'string') {
      imageUrl = displayImages[0];
    } else if (displayImages[0] && displayImages[0].url) {
      imageUrl = displayImages[0].url;
    }
  }

  // Check for flash sale / featured
  const hasFlashSale = product.is_flash_sale;
  const hasFeatured = product?.is_featured;
  const flashSalePrice = product.flash_sale_price || product.discountPrice;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      
      {/* Image & badges */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={displayName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />

        {/* Flash Sale Badge */}
        {(hasFlashSale || flashSalePrice) && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            {hasFlashSale ? 'FLASH SALE' : `${Math.round(((displayPrice - flashSalePrice) / displayPrice) * 100)}% OFF`}
          </div>
        )}

        {/* Featured Badge */}
        {hasFeatured && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
            FEATURED
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 m-0 mb-1 line-clamp-2">{displayName}</h3>

        {/* Category */}
        <p className="text-sm text-blue-600 font-medium m-0 mb-2 uppercase">{displayCategory}</p>

        {/* Description */}
        {displayDescription && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{displayDescription}</p>
        )}

        {/* Price */}
        <div className="mb-3">
          {hasFlashSale && flashSalePrice ? (
            <>
              <span className="text-gray-500 line-through text-sm mr-2">${displayPrice}</span>
              <span className="text-2xl font-bold text-red-600">${flashSalePrice}</span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-800">${displayPrice}</span>
          )}
        </div>

        {/* Stock */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              displayStock <= 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
            Stock: {displayStock}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 bg-black hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onEdit(product)}
            disabled={isDeleting}
          >
            Edit
          </button>

          <button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={() => onDelete(product._id || product.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
