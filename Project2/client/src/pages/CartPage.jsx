import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const {
    cartItems,
    itemsCount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Your bag is empty</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Discover something new from our collection!
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            You have {itemsCount} {itemsCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
        >
          Clear entire cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 divide-y divide-gray-100 dark:divide-slate-800 shadow-sm overflow-hidden">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition"
            >
              {/* Thumbnail */}
              <Link
                to={`/product/${item._id}`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-gray-100 dark:border-slate-800"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Item Info */}
              <div className="flex-1 space-y-1 min-w-0">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <Link
                  to={`/product/${item._id}`}
                  className="block text-sm sm:text-base font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate transition"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                  Unit Price: ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-950">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-2 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 transition"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-gray-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= (item.stock || 99)}
                    className="p-2 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="flex items-center gap-4">
                  <span className="text-base font-black text-gray-900 dark:text-white w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-slate-400">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${itemsPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                Estimated Shipping
                {shippingPrice === 0 && (
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                    FREE
                  </span>
                )}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {shippingPrice === 0 ? '$0.00' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-gray-600 dark:text-slate-400">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${taxPrice.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 pt-3 flex justify-between text-base font-black text-gray-900 dark:text-white">
              <span>Total Amount</span>
              <span className="text-xl text-indigo-600 dark:text-indigo-400">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {itemsPrice < 100 && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 rounded-xl text-xs text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                Add <strong>${(100 - itemsPrice).toFixed(2)}</strong> more for Free Shipping!
              </span>
            </div>
          )}

          <button
            onClick={handleProceedToCheckout}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-xs text-gray-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed 256-bit safe and secure checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
