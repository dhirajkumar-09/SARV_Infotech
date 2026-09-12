import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Boxes,
  DollarSign,
  X,
  Search,
} from 'lucide-react';
import productService from '../services/productService';
import Alert from '../components/Alert';

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [filterQuery, setFilterQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({ limit: 100 });
      setProducts(data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      stock: '20',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    });
    setIsModalOpen(true);
    setError(null);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      category: prod.category,
      stock: prod.stock.toString(),
      image: prod.image,
    });
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category.trim(),
        stock: Number(formData.stock),
        image: formData.image.trim(),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
        setSuccessMessage('Product updated successfully');
      } else {
        await productService.createProduct(payload);
        setSuccessMessage('Product created successfully');
      }

      closeModal();
      await loadProducts();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirmId(null);
      setSuccessMessage('Product removed from inventory');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalInventoryValue = products.reduce(
    (acc, p) => acc + (p.stock || 0) * (p.price || 0),
    0
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Admin Inventory Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Manage product listings, pricing, stock levels, and store inventory
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {successMessage && <Alert type="success" message={successMessage} />}
      {error && <Alert type="error" message={error} />}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              Total Products
            </p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{products.length}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              Total Units In Stock
            </p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totalStockUnits}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              Inventory Value
            </p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              ${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
        {/* Table Header Filter */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Catalog Inventory</h2>
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Filter catalog..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-indigo-200 dark:border-indigo-950 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500 dark:text-slate-400">
            No products match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-slate-300">
              <thead className="bg-gray-50 dark:bg-slate-950 text-gray-700 dark:text-slate-200 text-xs uppercase font-bold tracking-wider border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Stock Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white truncate max-w-xs">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-slate-500 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      {product.stock <= 0 ? (
                        <span className="text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 px-2.5 py-1 rounded-full text-xs font-bold">
                          Out of stock
                        </span>
                      ) : product.stock < 10 ? (
                        <span className="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 px-2.5 py-1 rounded-full text-xs font-bold">
                          Low: {product.stock} units
                        </span>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold">
                          {product.stock} units
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirmId === product._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(product._id)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Wireless Pro Studio Headphones"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="e.g. Audio"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="199.99"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    required
                    value={formData.stock}
                    onChange={handleFormChange}
                    placeholder="25"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Image URL (Unsplash or CDN) *
                </label>
                <input
                  type="url"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleFormChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Comprehensive description..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
