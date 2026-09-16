import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../../services/productService';
import { reviewService } from '../../services/orderService';
import { ProductGallery, QuantitySelector } from '../../components/product/ProductGallery';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, MapPin, AlertCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductById(id);
        const prodData = res.product || res.data?.product;
        setProduct(prodData);

        // Fetch product reviews
        if (prodData?._id) {
          const revRes = await reviewService.getProductReviews(prodData._id);
          setReviews(revRes.reviews || revRes.data?.reviews || []);
        }
      } catch (err) {
        console.error('Fetch product error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 my-6">
        <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
        <Link to="/shop" className="mt-4 inline-block text-xs font-bold text-brand-600">
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 10);

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity);
  };

  const handleBuyNow = async () => {
    const success = await addToCart(product._id, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewService.createReview({
        productId: product._id,
        rating: newRating,
        comment: newComment
      });
      toast.success('Review posted successfully!');
      setNewComment('');

      // Refresh reviews
      const revRes = await reviewService.getProductReviews(product._id);
      setReviews(revRes.data?.reviews || revRes.reviews || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-10 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-brand-600">Shop</Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        {/* Left: Gallery */}
        <ProductGallery
          images={product.images}
          productName={product.name}
          categoryName={typeof product.category === 'object' ? product.category?.name : product.category}
        />

        {/* Right: Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-extrabold rounded-md">
                {product.weight}
              </span>
              {product.discountPercentage > 0 && (
                <span className="px-2.5 py-0.5 bg-accent text-white text-[10px] font-extrabold rounded-md">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center bg-amber-50 text-amber-800 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-200">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                <span>{product.rating || 4.5}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                ({reviews.length} Verified Customer Reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-baseline space-x-3">
            <span className="text-3xl font-black text-gray-900">
              {formatCurrency(product.sellingPrice)}
            </span>
            {product.mrp > product.sellingPrice && (
              <span className="text-base text-gray-400 line-through">
                MRP {formatCurrency(product.mrp)}
              </span>
            )}
            <span className="text-xs font-bold text-brand-600 ml-auto">
              Save {formatCurrency(product.mrp - product.sellingPrice)}
            </span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2 text-xs font-bold">
            <span>Availability:</span>
            {isOutOfStock ? (
              <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Low Stock: Only {product.stock} items left
              </span>
            ) : (
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">In Stock ({product.stock} units available)</span>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-gray-700">Quantity:</span>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrease={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                max={product.stock || 99}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-extrabold text-xs transition-all shadow-md shadow-brand-600/30 flex items-center justify-center space-x-2 disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="flex-1 py-3.5 bg-accent hover:bg-amber-600 text-white rounded-2xl font-extrabold text-xs transition-all shadow-md disabled:opacity-40"
              >
                Buy Now
              </button>

              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isWishlisted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-red-500'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Store Info Badge */}
          {product.store && (
            <div className="p-4 bg-brand-50/50 rounded-2xl border border-brand-100 flex items-center space-x-3 text-xs">
              <MapPin className="w-5 h-5 text-brand-600 shrink-0" />
              <div>
                <p className="font-bold text-gray-900">Fulfilled by: {product.store.name}</p>
                <p className="text-gray-500">Express delivery within 8 km radius</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description & Specifications Tabs */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">
          Product Details & Description
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          {product.description || 'Authentic quality product from APK Grocery Stores.'}
        </p>

        {product.specifications?.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {product.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-semibold text-gray-500">{spec.key}</span>
                  <span className="font-bold text-gray-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-black text-gray-900 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-brand-600" />
            <span>Customer Reviews ({reviews.length})</span>
          </h3>
        </div>

        {/* Review Form */}
        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
            <h4 className="text-xs font-extrabold text-gray-900">Write a Review for this Product</h4>
            <div className="flex items-center space-x-2 text-xs font-bold">
              <span>Rating:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="text-amber-400 focus:outline-none"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your honest review about quality, freshness, packaging..."
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No customer reviews yet. Be the first to review after purchase!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{rev.customer?.name || 'Verified Customer'}</span>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-gray-400 block">
                  {new Date(rev.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
