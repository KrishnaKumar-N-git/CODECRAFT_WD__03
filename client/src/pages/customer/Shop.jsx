import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilters from '../../components/product/ProductFilters';
import { Pagination } from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { SlidersHorizontal, Search } from 'lucide-react';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });

  // Filters state initialized from URL search params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') || '',
    discount: searchParams.get('discount') || '',
    rating: searchParams.get('rating') || '',
    popular: searchParams.get('popular') || '',
    bestseller: searchParams.get('bestseller') || '',
    sort: searchParams.get('sort') || 'popular',
    page: parseInt(searchParams.get('page') || '1', 10)
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productService.getCategories();
        setCategories(res.data?.categories || res.categories || (Array.isArray(res.data) ? res.data : []));
      } catch (err) {
        console.error('Fetch categories error:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = { ...filters };
        // Remove empty strings
        Object.keys(queryParams).forEach((key) => {
          if (!queryParams[key]) delete queryParams[key];
        });

        const res = await productService.getProducts(queryParams);
        setProducts(res.products || res.data?.products || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    updateUrlParams(newFilters);
  };

  const handleResetFilters = () => {
    const reset = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: '',
      discount: '',
      rating: '',
      popular: '',
      bestseller: '',
      sort: 'popular',
      page: 1
    };
    setFilters(reset);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    updateUrlParams(newFilters);
  };

  const updateUrlParams = (newFilters) => {
    const params = {};
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k]) params[k] = newFilters[k];
    });
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Grocery Store Catalog</h1>
          <p className="text-xs text-gray-500">Showing {pagination.total} groceries and kitchen essentials</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl flex items-center space-x-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
            <span>Sort by:</span>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="popular">Popularity</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block">
          <ProductFilters
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Slideout Filters */}
        {showMobileFilters && (
          <div className="lg:hidden mb-4">
            <ProductFilters
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* Products Grid Column */}
        <div className="lg:col-span-3 space-y-6">
          {!loading && products.length === 0 ? (
            <EmptyState
              title="No groceries found"
              message="Try clearing your search query or adjusting your filters."
              icon={Search}
              action={
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              <ProductGrid products={products} loading={loading} skeletonCount={12} />
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
