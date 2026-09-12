import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import Hero3DVisual from '../components/Hero3DVisual';
import Alert from '../components/Alert';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL search params
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const sortByParam = searchParams.get('sortBy') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Component state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter state
  const [searchInput, setSearchInput] = useState(keywordParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState(sortByParam);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories once on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(['All', ...(data.categories || [])]);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Sync state if URL query params change
  useEffect(() => {
    setSearchInput(keywordParam);
    setSelectedCategory(categoryParam);
    setSortBy(sortByParam);
  }, [keywordParam, categoryParam, sortByParam]);

  // Fetch products when query filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          page: pageParam,
          limit: 12,
        };

        if (keywordParam) queryParams.keyword = keywordParam;
        if (categoryParam && categoryParam !== 'All') queryParams.category = categoryParam;
        if (sortByParam) queryParams.sortBy = sortByParam;
        if (minPrice) queryParams.minPrice = minPrice;
        if (maxPrice) queryParams.maxPrice = maxPrice;

        const data = await productService.getProducts(queryParams);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.total || 0);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keywordParam, categoryParam, sortByParam, pageParam, minPrice, maxPrice]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    updateURL({ category, page: 1 });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    updateURL({ sortBy: newSort, page: 1 });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateURL({ keyword: searchInput, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedCategory('All');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const updateURL = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newParams };

    Object.keys(updated).forEach((key) => {
      if (!updated[key] || updated[key] === 'All') {
        delete updated[key];
      }
    });

    setSearchParams(updated);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 3D Hero Banner Section - Distinct Light vs Dark Styling */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 text-white shadow-xl dark:shadow-2xl shadow-indigo-500/10 dark:shadow-black/60 py-12 sm:py-16 px-6 sm:px-12 border border-indigo-400/30 dark:border-indigo-500/20 transition-all duration-300">
        <div className="absolute inset-0 opacity-15 dark:opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 dark:bg-white/5 backdrop-blur-md border border-white/25 dark:border-white/10 text-xs font-bold tracking-wide uppercase text-indigo-100 dark:text-indigo-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>Interactive 3D Experience</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Curated Tech,{' '}
              <span className="bg-gradient-to-r from-amber-200 via-pink-200 to-indigo-200 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                Elevated Design.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-indigo-100/90 dark:text-indigo-200/80 font-normal max-w-xl leading-relaxed">
              Discover top-tier acoustics, smart computing, and modern daily gear with fluid 3D parallax tilt, immediate filtering, and secure Stripe checkout.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#products-section"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-white text-indigo-900 dark:text-indigo-950 font-bold text-sm hover:bg-indigo-50 shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <ShoppingBag className="w-4 h-4 mr-2 text-indigo-600" />
                Shop Products
              </a>
              <button
                onClick={() => handleCategorySelect('Audio')}
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm transition"
              >
                Top Audio Gear
              </button>
            </div>
          </div>

          {/* Right: Interactive 3D Visual Stage */}
          <div className="lg:col-span-5 flex justify-center">
            <Hero3DVisual />
          </div>
        </div>
      </section>

      {/* Search, Filter & Sort Controls */}
      <section id="products-section" className="space-y-4">
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 shadow-sm ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105'
                  : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              placeholder="Search products by keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
            <button
              type="submit"
              className="absolute right-2 top-2 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </form>

          {/* Right Toolbar: Price Filter toggle & Sort Dropdown */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                showFilters || minPrice || maxPrice
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Price Range</span>
              {(minPrice || maxPrice) && (
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-1.5">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="bg-transparent text-sm font-semibold text-gray-800 dark:text-slate-200 outline-none cursor-pointer py-1"
              >
                <option value="newest" className="dark:bg-slate-900">Newest Arrivals</option>
                <option value="price_asc" className="dark:bg-slate-900">Price: Low to High</option>
                <option value="price_desc" className="dark:bg-slate-900">Price: High to Low</option>
                <option value="rating" className="dark:bg-slate-900">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expandable Price Range Filter Panel */}
        {showFilters && (
          <div className="bg-indigo-50/70 dark:bg-slate-900/80 border border-indigo-100 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                Price Range ($):
              </span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 px-3 py-1.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm outline-none focus:border-indigo-500"
              />
              <span className="text-gray-400 font-bold">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 px-3 py-1.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset All
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Error Message */}
      {error && <Alert type="error" message={error} />}

      {/* Active Filter Indicators */}
      {(keywordParam || (categoryParam && categoryParam !== 'All') || minPrice || maxPrice) && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 flex-wrap">
          <span>Showing results for:</span>
          {keywordParam && (
            <span className="bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-slate-200 px-2.5 py-0.5 rounded-full font-semibold">
              "{keywordParam}"
            </span>
          )}
          {categoryParam && categoryParam !== 'All' && (
            <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-semibold">
              Category: {categoryParam}
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-semibold">
              ${minPrice || 0} - ${maxPrice || '∞'}
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Product Grid Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-square bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No products found</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            We couldn't find any products matching your current search or filter criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            Clear Filters & View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={pageParam <= 1}
            onClick={() => updateURL({ page: pageParam - 1 })}
            className="p-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNumber = idx + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => updateURL({ page: pageNumber })}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition ${
                  pageParam === pageNumber
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            disabled={pageParam >= totalPages}
            onClick={() => updateURL({ page: pageParam + 1 })}
            className="p-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
