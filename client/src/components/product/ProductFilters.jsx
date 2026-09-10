import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export const ProductFilters = ({
  categories = [],
  filters,
  onFilterChange,
  onResetFilters
}) => {
  return (
    <aside className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-sm font-extrabold text-gray-900 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters</span>
        </h3>
        <button
          onClick={onResetFilters}
          className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">
          Categories
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 font-medium focus:outline-none focus:border-brand-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2 focus:outline-none focus:border-brand-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Availability & Discount */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={(e) => onFilterChange('inStock', e.target.checked ? 'true' : '')}
            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
          />
          <span>In Stock Only</span>
        </label>

        <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.discount === 'true'}
            onChange={(e) => onFilterChange('discount', e.target.checked ? 'true' : '')}
            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
          />
          <span>On Discount Only</span>
        </label>
      </div>

      {/* Minimum Rating Filter */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">
          Rating
        </label>
        <div className="space-y-1.5 text-xs font-medium text-gray-700">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === String(r)}
                onChange={() => onFilterChange('rating', String(r))}
                className="text-brand-600 focus:ring-brand-500"
              />
              <span>{r}★ & above</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ProductFilters;
