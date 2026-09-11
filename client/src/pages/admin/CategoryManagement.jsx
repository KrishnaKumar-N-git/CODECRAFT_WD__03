import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Layers, Plus, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCategorySvg } from '../../utils/grocerySvgLibrary';

export const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '', imageUrl: '' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data?.categories || res.data.categories || (Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', {
        name: newCat.name,
        description: newCat.description,
        image: newCat.imageUrl ? { url: newCat.imageUrl } : undefined
      });
      toast.success('Category created successfully');
      setNewCat({ name: '', description: '', imageUrl: '' });
      setShowAddForm(false);
      fetchCategories();
    } catch (err) {
      toast.error('Failed to create category');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-purple-600" />
            <span>Grocery Category Catalog</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage GrocMart global category taxonomy</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-purple-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateCategory} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-gray-900">Add Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Category Name (e.g. Fruits & Vegetables)"
              required
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              className="p-3 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="url"
              placeholder="Image URL"
              value={newCat.imageUrl}
              onChange={(e) => setNewCat({ ...newCat, imageUrl: e.target.value })}
              className="p-3 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <input
            type="text"
            placeholder="Short Description"
            value={newCat.description}
            onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
            className="w-full p-3 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button type="submit" className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold">
            Save Category
          </button>
        </form>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={(() => {
                    const rawUrl = typeof cat.image === 'string' ? cat.image : cat.image?.url;
                    return (rawUrl && typeof rawUrl === 'string' && !rawUrl.includes('unsplash.com') && !rawUrl.includes('via.placeholder'))
                      ? rawUrl
                      : getCategorySvg(cat.name);
                  })()}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getCategorySvg(cat.name);
                  }}
                  className="w-12 h-12 rounded-2xl object-cover border border-gray-100"
                />

                <div>
                  <h4 className="font-bold text-gray-900 text-xs">{cat.name}</h4>
                  <p className="text-[10px] text-gray-400 line-clamp-1">{cat.description || 'Grocery category'}</p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteCategory(cat._id, cat.name)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
