import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import TiltCard from './TiltCard';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <TiltCard maxTilt={10} scale={1.02} className="h-full">
      <div className="group bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/60 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full overflow-hidden">
        {/* Product Image Box */}
        <Link
          to={`/product/${product._id}`}
          className="relative block aspect-square overflow-hidden bg-gray-100 dark:bg-slate-800"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Category Pill */}
          <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-gray-800 dark:text-slate-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-black/5 dark:border-white/10">
            {product.category}
          </span>

          {/* Stock Status Badge */}
          {isOutOfStock ? (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          ) : product.stock < 10 ? (
            <span className="absolute top-3 right-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              Only {product.stock} left
            </span>
          ) : null}
        </Link>

        {/* Details Container */}
        <div className="p-5 flex flex-col flex-1">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-slate-300">
              {product.rating ? product.rating.toFixed(1) : '4.5'}
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-500">
              ({product.numReviews || 12})
            </span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product._id}`}
            className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* Bottom Bar: Price & Add Button */}
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 block">
                Price
              </span>
              <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isOutOfStock
                  ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white scale-95 shadow-emerald-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white active:scale-95 shadow-indigo-500/20'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default ProductCard;
