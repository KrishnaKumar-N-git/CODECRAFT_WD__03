import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Store, ShieldCheck, CheckCircle, XCircle, MapPin, Phone, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stores');
      setStores(res.data.data?.stores || []);
    } catch (err) {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleStatusChange = async (storeId, newStatus) => {
    try {
      await api.put(`/admin/stores/${storeId}/status`, { status: newStatus });
      toast.success(`Store status changed to ${newStatus}`);
      setStores(stores.map((s) => (s._id === storeId ? { ...s, status: newStatus } : s)));
    } catch (err) {
      toast.error('Failed to update store status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Store className="w-7 h-7 text-purple-600" />
            <span>Store Owner & Vendor Approvals</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Review, approve, or suspend shop owners selling on the platform</p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Loading multi-vendor stores...</p>
        </div>
      ) : stores.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <Store className="w-12 h-12 text-gray-300 mx-auto" />
          <h4 className="text-sm font-bold text-gray-900">No Stores Registered</h4>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-100">
              <tr>
                <th className="p-4">Store Profile</th>
                <th className="p-4">Owner Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stores.map((store) => (
                <tr key={store._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{store.name}</h4>
                        <p className="text-[10px] text-gray-400">Rating: ⭐ {store.rating || '4.8'} ({store.reviewCount || 0})</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{store.owner?.name || 'Owner'}</p>
                    <p className="text-[10px] text-gray-500">{store.owner?.email}</p>
                    <p className="text-[10px] text-gray-400">{store.phone}</p>
                  </td>
                  <td className="p-4 text-gray-700">
                    <p className="font-medium">{store.address?.area || 'Indiranagar'}</p>
                    <p className="text-[10px] text-gray-400">{store.address?.city} ({store.address?.pincode})</p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                        store.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : store.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {store.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {store.status !== 'ACTIVE' && (
                        <button
                          onClick={() => handleStatusChange(store._id, 'ACTIVE')}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-700 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {store.status !== 'SUSPENDED' && (
                        <button
                          onClick={() => handleStatusChange(store._id, 'SUSPENDED')}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-[11px] font-bold hover:bg-red-700 transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
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

export default StoreManagement;
