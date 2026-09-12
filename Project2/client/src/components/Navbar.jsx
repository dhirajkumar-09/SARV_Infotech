import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  User,
  LogOut,
  Package,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemsCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?keyword=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span>
              Aura<span className="text-indigo-600 dark:text-indigo-400">Shop</span>
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg relative items-center"
          >
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-full focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 pointer-events-none" />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </form>

          {/* Desktop Right Navigation */}
          <nav className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className={`text-sm font-semibold transition px-2.5 py-1.5 rounded-lg ${
                location.pathname === '/'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-gray-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Shop
            </Link>

            {/* Tactile Sliding Theme Switch */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-300/80 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-xs font-bold transition-all shadow-sm"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
              aria-label="Toggle Night Mode"
            >
              <div className="relative w-8 h-4 rounded-full bg-gray-300 dark:bg-indigo-600 transition-colors">
                <div
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${
                    isDark ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <span className="flex items-center gap-1">
                {isDark ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Night</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </>
                )}
              </span>
            </button>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              title="View Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center shadow-md animate-pulse">
                  {itemsCount}
                </span>
              )}
            </Link>

            {/* Auth Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-1.5 px-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-xs text-gray-400 dark:text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.email}
                      </p>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" /> Admin Account
                        </span>
                      )}
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                      <Package className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                      Order History
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 font-medium transition"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-gray-100 dark:border-slate-800 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-md shadow-indigo-500/20 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Actions: Dark toggle & Cart & Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
              title="Toggle Night Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <Link
              to="/cart"
              className="relative p-2 text-gray-700 dark:text-slate-300"
              title="Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="py-2.5 border-t border-gray-100 dark:border-slate-800 md:hidden">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-slate-950 border border-transparent dark:border-slate-800 text-gray-900 dark:text-white rounded-full focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 pointer-events-none" />
          </form>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 rounded-lg"
            >
              Shop All Products
            </Link>

            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 border-t border-gray-100 dark:border-slate-800">
                  <p className="text-xs text-gray-400 dark:text-slate-400">Signed in as</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{user?.name}</p>
                </div>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg"
                >
                  <Package className="w-4 h-4" />
                  Order History
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2 px-4 rounded-xl border border-gray-300 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2 px-4 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
