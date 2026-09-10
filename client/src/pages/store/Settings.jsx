import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Store, Save, Clock, MapPin, Phone, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const StoreSettings = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
    openingTime: '07:00 AM',
    closingTime: '10:00 PM',
    deliveryFee: 30,
    minimumOrder: 99,
    deliveryRadius: 8,
    street: '',
    area: '',
    city: 'Bengaluru',
    pincode: '560038'
  });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await api.get('/stores');
        const list = res.data.data?.stores || [];
        if (list.length > 0) {
          const s = list[0];
          setStore(s);
          setFormData({
            name: s.name || '',
            phone: s.phone || '',
            description: s.description || '',
            openingTime: s.openingTime || '07:00 AM',
            closingTime: s.closingTime || '10:00 PM',
            deliveryFee: s.deliveryFee || 30,
            minimumOrder: s.minimumOrder || 99,
            deliveryRadius: s.deliveryRadius || 8,
            street: s.address?.street || '',
            area: s.address?.area || '',
            city: s.address?.city || 'Bengaluru',
            pincode: s.address?.pincode || '560038'
          });
        }
      } catch (err) {
        toast.error('Failed to load store settings');
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!store?._id) return;
    try {
      setSaving(true);
      await api.put(`/stores/${store._id}`, {
        name: formData.name,
        phone: formData.phone,
        description: formData.description,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        deliveryFee: Number(formData.deliveryFee),
        minimumOrder: Number(formData.minimumOrder),
        deliveryRadius: Number(formData.deliveryRadius),
        address: {
          street: formData.street,
          area: formData.area,
          city: formData.city,
          pincode: formData.pincode
        }
      });
      toast.success('Store profile & settings updated!');
    } catch (err) {
      toast.error('Failed to update store settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-xs text-gray-500 mt-2">Loading store profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Store className="w-7 h-7 text-emerald-600" />
          <span>Store Settings & Profile</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">Configure your shop details, delivery charges, and store hours</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Store Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Store Phone *</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Delivery Fee (₹)</label>
            <input
              type="number"
              value={formData.deliveryFee}
              onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Min Order Amount (₹)</label>
            <input
              type="number"
              value={formData.minimumOrder}
              onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Delivery Radius (km)</label>
            <input
              type="number"
              value={formData.deliveryRadius}
              onChange={(e) => setFormData({ ...formData, deliveryRadius: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Opening Time</label>
            <input
              type="text"
              value={formData.openingTime}
              onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Closing Time</label>
            <input
              type="text"
              value={formData.closingTime}
              onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Street Address</label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Area"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Settings...' : 'Save Store Profile'}</span>
        </button>
      </form>
    </div>
  );
};

export default StoreSettings;
