import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import orderService from '../services/orderService';
import Alert from '../components/Alert';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getMyOrders();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Your Orders
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Review all your past purchases and track order deliveries
        </p>
      </div>

      {error && <Alert type="error" message={error} />}

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No orders placed yet</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            You haven't made any purchases with this account. Check out our store to find something special!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-indigo-500/20"
          >
            <span>Start Browsing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-600/50 transition"
            >
              {/* Order Header */}
              <div className="bg-gray-50/80 dark:bg-slate-950/60 p-5 sm:px-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-slate-400">
                  <div>
                    <span className="text-gray-400 dark:text-slate-500 block font-medium">Order Placed</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-gray-200 dark:bg-slate-800 hidden sm:block"></div>
                  <div>
                    <span className="text-gray-400 dark:text-slate-500 block font-medium">Total Amount</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${order.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-gray-200 dark:bg-slate-800 hidden sm:block"></div>
                  <div>
                    <span className="text-gray-400 dark:text-slate-500 block font-medium">Order ID</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[120px] sm:max-w-none block">
                      #{order._id}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                    <CreditCard className="w-3 h-3" /> Paid
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      order.isDelivered
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400'
                    }`}
                  >
                    <Truck className="w-3 h-3" />
                    {order.isDelivered ? 'Delivered' : 'Preparing to Ship'}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-5 sm:p-6 divide-y divide-gray-100 dark:divide-slate-800">
                {order.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate block transition"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                          Qty: {item.quantity} × ${item.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-black text-gray-900 dark:text-white shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50/50 dark:bg-slate-950/40 px-5 sm:px-6 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                <span>
                  Delivering to: <strong className="text-gray-700 dark:text-slate-200">{order.shippingAddress?.address}, {order.shippingAddress?.city}</strong>
                </span>
                <Link
                  to={`/order/${order._id}/confirmation`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span>View Receipt</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
