import React from 'react';

const ProductCard = ({ product, onEdit, onDelete }) =>
{
  // Handle both API data structure and form data structure
  const displayName = product.name || product.title;
  const displayPrice = product.price;
  const displayCategory = product.category;
  const displayStock = product.stock;
  const displayImages = product.images;

  // Get the first image URL
  let imageUrl = '';
  if (Array.isArray(displayImages) && displayImages.length > 0) {
    if (typeof displayImages[0] === 'string') {
      imageUrl = displayImages[0];
    } else if (displayImages[0] && displayImages[0].url) {
      imageUrl = displayImages[0].url;
    }
  }

  // Check for flash sale
  const hasFlashSale = product.is_flash_sale;
  const hasFeatured = product?.is_featured
  const flashSalePrice = product.flash_sale_price || product.discountPrice;


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={displayName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {(hasFlashSale || flashSalePrice) && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            {hasFlashSale ? 'FLASH SALE' : `${Math.round(((displayPrice - flashSalePrice) / displayPrice) * 100)}% OFF`}
          </div>
        )}
         {(hasFeatured) && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
            {hasFeatured ? 'FEATURED' : ``}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 m-0 mb-1 line-clamp-2">{displayName}</h3>
        <p className="text-sm text-blue-600 font-medium m-0 mb-3 uppercase">{displayCategory}</p>

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

        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${displayStock <= 10
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
            }`}>
            Stock: {displayStock}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 bg-black hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>
          <button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            onClick={() => onDelete(product._id || product.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;