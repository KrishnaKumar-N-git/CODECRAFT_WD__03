import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import storeService from '../../services/storeService';
import ProductGrid from '../../components/product/ProductGrid';
import {
  ShoppingBag,
  Sparkles,
  Search,
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  ChevronRight,
  Star,
  Store,
  Layers,
  HeartHandshake
} from 'lucide-react';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, popRes, dealRes, bestRes, storeRes] = await Promise.all([
          productService.getCategories(),
          productService.getProducts({ popular: 'true', limit: 8 }),
          productService.getProducts({ discount: 'true', limit: 8 }),
          productService.getProducts({ bestseller: 'true', limit: 8 }),
          storeService.getStores()
        ]);

        setCategories(catRes.data?.categories || catRes.categories || (Array.isArray(catRes.data) ? catRes.data : []));
        setPopularProducts(popRes.products || popRes.data?.products || []);
        setDealProducts(dealRes.products || dealRes.data?.products || []);
        setBestSellers(bestRes.products || bestRes.data?.products || []);
        const storesList = storeRes.stores || storeRes.data?.stores || [];
        setStores(storesList);
        if (storesList.length > 0) {
          setSelectedStore(storesList[0]);
        }
      } catch (error) {
        console.error('Home data load error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* 1. BigBasket Hero Showcase Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-emerald-800/40">
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/60 text-emerald-200 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Multi-Vendor Kirana Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            India's largest multi-vendor grocery store online.
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
            Buy farm-fresh vegetables, basmati rice, cooking oils, dairy & daily staples directly from your favorite verified neighborhood shop owners.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/shop"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-600/30 transition-all flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore All Groceries</span>
            </Link>
            <Link
              to="/categories"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-2xl font-extrabold text-xs transition-all"
            >
              Category Catalog
            </Link>
          </div>
        </div>

        {/* Hero Decorative Banner Image */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-96 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop"
            alt="GrocMart Grocery Essentials"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 2. Store Selector Strip for Multi-Vendor Kirana Marketplace */}
      {stores.length > 0 && (
        <section className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-gray-900">Select Local Vendor Store</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {stores.length} Active Kirana Stores
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stores.map((s) => (
              <div
                key={s._id}
                onClick={() => setSelectedStore(s)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedStore?._id === s._id
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-gray-900">{s.name}</h4>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    ⭐ {s.rating || 4.9}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 truncate">{s.address?.area || 'Local Store'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Grocery Categories Catalog */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Shop by Grocery Category</span>
            </h2>
            <p className="text-xs text-gray-500">Curated staples, pulses, oil, dairy and fresh produce</p>
          </div>
          <Link to="/categories" className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1">
            <span>View All Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat._id}`}
              className="group bg-white p-3.5 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all text-center space-y-2"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 p-1 overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src={cat.image?.url || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop'}
                  alt={cat.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop';
                  }}
                  className="w-full h-full object-cover rounded-xl"
                />

              </div>
              <p className="text-[11px] font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-700">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Today's Deals */}
      {dealProducts.length > 0 && (
        <section className="space-y-4 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-emerald-600 text-white rounded-2xl shadow-md">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Deals of the Day</h2>
                <p className="text-xs text-emerald-800 font-bold">Unbeatable discounts on essential kitchen supplies</p>
              </div>
            </div>
            <Link to="/shop?discount=true" className="text-xs font-extrabold text-emerald-800 hover:text-emerald-900 flex items-center space-x-1">
              <span>View All Deals</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={dealProducts} loading={loading} skeletonCount={4} />
        </section>
      )}

      {/* 5. Popular Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Popular Grocery Items</h2>
            <p className="text-xs text-gray-500">Most requested products across multi-vendor stores</p>
          </div>
          <Link to="/shop?popular=true" className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={popularProducts} loading={loading} skeletonCount={8} />
      </section>

      {/* 6. Best Sellers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Best Sellers</h2>
            <p className="text-xs text-gray-500">Top selling daily groceries</p>
          </div>
          <Link to="/shop?bestseller=true" className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={bestSellers} loading={loading} skeletonCount={4} />
      </section>

      {/* 7. Why Shop on GrocMart */}
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-black text-gray-900">Why Shop on GrocMart?</h2>
          <p className="text-xs text-gray-500 mt-1">Connecting verified shop owners directly with neighborhood shoppers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-emerald-50/50 rounded-3xl text-center space-y-2 border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-gray-900">15-Min Doorstep Delivery</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Superfast delivery directly from nearest kirana store counters.
            </p>
          </div>

          <div className="p-5 bg-emerald-50/50 rounded-3xl text-center space-y-2 border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-gray-900">Online UPI QR Scanner</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Scan dynamic QR codes using GPay, PhonePe, or Paytm with instant payment confirmation.
            </p>
          </div>

          <div className="p-5 bg-emerald-50/50 rounded-3xl text-center space-y-2 border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-gray-900">Empower Shop Owners</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Empowering local store owners with digital inventory & order fulfillment tools.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
