import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Check,
  ChevronLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import TiltCard from '../components/TiltCard';
import Alert from '../components/Alert';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        setProduct(data.product);
        setQuantity(1);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-950 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto my-12 space-y-4">
        <Alert type="error" message={error || 'Product could not be found.'} />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
          Home
        </Link>
        <span>/</span>
        <Link
          to={`/?category=${encodeURIComponent(product.category)}`}
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs sm:max-w-sm">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-slate-800 shadow-sm">
        {/* Left Column: Interactive 3D Tilt Showcase */}
        <div>
          <TiltCard maxTilt={14} scale={1.03}>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 flex items-center justify-center group shadow-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-gray-800 dark:text-slate-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-black/5 dark:border-white/10">
                {product.category}
              </span>
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white/90 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Hover to 3D Tilt</span>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="flex flex-col space-y-6">
          {/* Header & Rating */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 4.5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-slate-200">
                {product.rating?.toFixed(1) || '4.5'}
              </span>
              <span className="text-sm text-gray-400 dark:text-slate-500">
                ({product.numReviews || 24} customer ratings)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Pricing & Stock Status */}
          <div className="flex items-baseline gap-4 py-3 border-y border-gray-100 dark:border-slate-800">
            <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-200 dark:border-red-900">
                  Out of Stock
                </span>
              ) : (
                <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              Overview
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="space-y-4 pt-2">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-950">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 disabled:opacity-40 transition font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3.5 py-2 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 disabled:opacity-40 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full sm:flex-1 py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isOutOfStock
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                    : added
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 active:scale-[0.99]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Your Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {isOutOfStock ? 'Sold Out' : 'Add to Shopping Bag'}
                  </>
                )}
              </button>

              <Link
                to="/cart"
                className="w-full sm:w-auto py-4 px-6 rounded-2xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200 font-semibold text-sm text-center transition"
              >
                View Cart
              </Link>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
              <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Free shipping over $100</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
              <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>30-day money back</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>1-year official warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
