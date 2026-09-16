import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/formatCurrency';
import { Plus, Search, Edit3, Trash2, Package, Tag, Star, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductSvg } from '../../utils/grocerySvgLibrary';

export const StoreProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({ limit: 100 });
      setProducts(res.products || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="w-7 h-7 text-emerald-600" />
            <span>Store Products Catalog</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage stock items, pricing, MRP, and product details</p>
        </div>

        <Link
          to="/store/products/new"
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs focus:outline-none text-gray-900"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h4 className="text-sm font-bold text-gray-900">No Products Found</h4>
          <p className="text-xs text-gray-500">Try adjusting your search query or add a new product.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-100">
                <tr>
                  <th className="p-4">Product Info</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">MRP & Selling Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {(() => {
                          const rawUrl = typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url;
                          const fallbackSvg = getProductSvg(product.name, product.category?.name);
                          const imgSrc = (rawUrl && typeof rawUrl === 'string' && rawUrl.trim().length > 0) ? rawUrl : fallbackSvg;
                          return (
                            <img
                              src={imgSrc}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = fallbackSvg;
                              }}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                            />
                          );
                        })()}
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs">{product.name}</h4>
                          <p className="text-[10px] text-gray-400">Brand: {product.brand || 'Generic'} • {product.weight || 'Pack'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 font-semibold">
                      {product.category?.name || 'Grocery'}
                    </td>
                    <td className="p-4">
                      <span className="font-black text-emerald-700">{formatCurrency(product.sellingPrice)}</span>
                      <span className="text-[10px] text-gray-400 line-through ml-1 font-semibold">{formatCurrency(product.mrp)}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          product.stock <= product.lowStockThreshold
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/store/products/edit/${product._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreProducts;
