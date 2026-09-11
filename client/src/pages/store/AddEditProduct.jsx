import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import api from '../../services/api';
import { ArrowLeft, Save, Package, Image as ImageIcon, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductSvg } from '../../utils/grocerySvgLibrary';

export const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    weight: '1 kg',
    mrp: '',
    sellingPrice: '',
    stock: 50,
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        const list = res.data.data?.categories || [];
        setCategories(list);
        if (list.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: list[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCats();

    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await productService.getProductById(id);
          const p = res.product;
          setFormData({
            name: p.name || '',
            category: p.category?._id || p.category || '',
            brand: p.brand || '',
            weight: p.weight || '1 kg',
            mrp: p.mrp || '',
            sellingPrice: p.sellingPrice || '',
            stock: p.stock || 0,
            description: p.description || '',
            imageUrl: p.images?.[0]?.url || ''
          });
        } catch (err) {
          toast.error('Failed to fetch product details');
        }
      };
    }
  }, [id, isEdit]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target.result;
      setFormData((prev) => ({ ...prev, imageUrl: base64Url }));
      toast.success('Photo loaded from your device!');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        weight: formData.weight,
        mrp: Number(formData.mrp),
        sellingPrice: Number(formData.sellingPrice),
        stock: Number(formData.stock),
        description: formData.description,
        images: formData.imageUrl ? [{ url: formData.imageUrl, isPrimary: true }] : []
      };

      if (isEdit) {
        await productService.updateProduct(id, payload);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(payload);
        toast.success('New product created successfully');
      }

      navigate('/store/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/store/products"
          className="flex items-center space-x-2 text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <h2 className="text-xl font-black text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Product Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Aashirvaad Sharbati Atta 5kg"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Brand Name</label>
            <input
              type="text"
              placeholder="e.g. Fortune, Amul, Tata"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">MRP (₹) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="340"
              value={formData.mrp}
              onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Selling Price (₹) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="295"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Stock Quantity *</label>
            <input
              type="number"
              required
              min="0"
              placeholder="50"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Weight / Package Size</label>
            <input
              type="text"
              placeholder="e.g. 500g Pack, 1 L Bottle, 5 kg Bag"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2 col-span-1 sm:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">Product Photo</label>
              <span className="text-[10px] text-emerald-700 font-bold">Auto-generates icon if left empty</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Direct File Picker Button */}
              <label className="flex items-center justify-center space-x-2 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-dashed border-emerald-300 rounded-xl cursor-pointer font-bold text-xs transition-colors">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload Photo from Device</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Or Web Link Input */}
              <input
                type="url"
                placeholder="Or paste web image link (.jpg/.png)..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Live Image Preview */}
            <div className="flex items-center space-x-3 p-2.5 bg-gray-50 rounded-xl border border-gray-200">
              <img
                src={formData.imageUrl || getProductSvg(formData.name || 'Grocery Product')}
                alt="Product Preview"
                className="w-14 h-14 object-cover rounded-lg border border-gray-200 bg-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getProductSvg(formData.name || 'Grocery Product');
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {formData.imageUrl ? (formData.imageUrl.startsWith('data:') ? 'Photo loaded from device' : 'Web Image Link') : 'Auto-generated GrocMart graphic'}
                </p>
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    className="text-[10px] text-red-600 font-bold hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <X className="w-3 h-3" /> Clear Custom Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Product Description</label>
          <textarea
            rows={3}
            placeholder="Fresh, organic and high quality grocery staple..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving Product...' : isEdit ? 'Update Product' : 'Create Product'}</span>
        </button>
      </form>
    </div>
  );
};

export default AddEditProduct;
