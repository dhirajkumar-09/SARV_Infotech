import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Shield, Truck, RotateCcw, CreditCard, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 mt-20 transition-colors duration-300">
      {/* Feature Highlights Banner */}
      <div className="border-b border-gray-100 dark:border-slate-800/80 bg-indigo-50/40 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Free Express Delivery</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">On all domestic orders over $100</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Encrypted Payments</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Powered by Stripe 256-bit security</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">30-Day Easy Returns</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Hassle-free guarantee on all items</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Flexible Checkout</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Major credit cards & Stripe ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-gray-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span>Aura<span className="text-indigo-600 dark:text-indigo-400">Shop</span></span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              Curated premium tech, lifestyle accessories, and electronics designed to elevate your everyday workflow.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Categories</h5>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <li><Link to="/?category=Electronics" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Electronics & Computers</Link></li>
              <li><Link to="/?category=Audio" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Audio & Headphones</Link></li>
              <li><Link to="/?category=Wearables" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Smart Wearables</Link></li>
              <li><Link to="/?category=Accessories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Bags & Accessories</Link></li>
              <li><Link to="/?category=Home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Home & Office</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Customer Care</h5>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <li><Link to="/orders" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Track Your Order</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Shopping Bag</Link></li>
              <li><Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Account Sign In</Link></li>
              <li><span className="text-gray-400 dark:text-slate-600">Shipping & Delivery FAQ</span></li>
              <li><span className="text-gray-400 dark:text-slate-600">Privacy Policy</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Stay Updated</h5>
            <p className="text-sm text-gray-500 dark:text-slate-400">Subscribe for early access drops, special discounts, and tech guides.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 text-sm bg-gray-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none flex-1"
              />
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AuraShop Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> React, Node.js, MongoDB & Stripe
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
