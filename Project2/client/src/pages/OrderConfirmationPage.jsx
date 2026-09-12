import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, Calendar, CreditCard, MapPin } from 'lucide-react';
import orderService from '../services/orderService';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await orderService.getOrderById(id);
          setOrder(res.order);
        } catch (err) {
          console.error('Failed to load confirmed order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      {/* Confirmation Header */}
      <div className="text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/40">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Payment Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Thank you for your order!
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md mx-auto">
            We've received your payment and are getting your items ready for shipment.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-gray-50 dark:bg-slate-950 px-4 py-2 rounded-xl text-xs font-mono text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-800">
          <span>Order ID:</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{order?._id || id}</span>
        </div>
      </div>

      {order && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
            Receipt Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-slate-400">
            <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl space-y-2 border border-gray-100 dark:border-slate-800">
              <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Shipping Destination:
              </span>
              <p className="font-medium text-gray-800 dark:text-slate-200">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl space-y-2 border border-gray-100 dark:border-slate-800">
              <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Payment & Status:
              </span>
              <p className="flex justify-between">
                <span>Method:</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200">{order.paymentMethod || 'Stripe'}</span>
              </p>
              <p className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full text-[10px]">
                  PAID
                </span>
              </p>
              <p className="flex justify-between">
                <span>Date:</span>
                <span className="text-gray-700 dark:text-slate-300 font-medium">
                  {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
              Items In This Order
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex justify-between items-center text-sm font-black text-gray-900 dark:text-white">
            <span>Total Paid</span>
            <span className="text-xl text-indigo-600 dark:text-indigo-400">${order.totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition"
        >
          <Package className="w-4 h-4" />
          <span>View My Orders</span>
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200 font-bold text-sm transition"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
