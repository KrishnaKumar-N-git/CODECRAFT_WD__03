import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/formatCurrency';
import { Package, Save, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const StoreInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({ limit: 100 });
      setProducts(res.products || []);
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id, newStock) => {
    setProducts(products.map((p) => (p._id === id ? { ...p, stock: Number(newStock) } : p)));
  };

  const handleSaveStock = async (product) => {
    try {
      setUpdatingId(product._id);
      await productService.updateProduct(product._id, { stock: product.stock });
      toast.success(`Updated stock for ${product.name}`);
    } catch (err) {
      toast.error('Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="w-7 h-7 text-emerald-600" />
            <span>Real-time Stock Inventory</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Quickly adjust stock levels and manage low inventory warnings</p>
        </div>
        <button
          onClick={fetchInventory}
          className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Loading inventory...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU / Code</th>
                <th className="p-4">Selling Price</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images?.[0]?.url || 'https://picsum.photos/80/80'}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{product.name}</h4>
                        <p className="text-[10px] text-gray-400">{product.weight}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-gray-600">{product.sku || 'SKU-APK-001'}</td>
                  <td className="p-4 font-black text-emerald-700">{formatCurrency(product.sellingPrice)}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      min="0"
                      value={product.stock}
                      onChange={(e) => handleStockChange(product._id, e.target.value)}
                      className="w-24 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      disabled={updatingId === product._id}
                      onClick={() => handleSaveStock(product)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 ml-auto transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{updatingId === product._id ? 'Saving...' : 'Update'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StoreInventory;
