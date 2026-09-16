import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import { Grid, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await productService.getCategories();
        setCategories(res.data?.categories || res.categories || (Array.isArray(res.data) ? res.data : []));
      } catch (err) {
        console.error('Categories load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Grid className="w-6 h-6 text-brand-600" /> Grocery Categories
          </h1>
          <p className="text-xs text-gray-500">Browse everyday essentials by category</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-shimmer h-36"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat._id}`}
              className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center space-y-3 flex flex-col justify-between"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden group-hover:scale-105 transition-transform shadow-sm">
                <ImageWithFallback
                  src={typeof cat.image === 'string' ? cat.image : cat.image?.url}
                  alt={cat.name}
                  categoryName={cat.name}
                  className="w-full h-full object-cover rounded-2xl"
                  iconSize="text-3xl"
                  showLabel={false}
                />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{cat.description}</p>
              </div>
              <span className="text-[10px] font-bold text-brand-600 flex items-center justify-center space-x-1 pt-1 border-t border-gray-50">
                <span>Browse Products</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
