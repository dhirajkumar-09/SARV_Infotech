import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  ShieldCheck,
  CreditCard,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import paymentService from '../services/paymentService';
import orderService from '../services/orderService';
import StripePaymentForm from '../components/StripePaymentForm';
import Alert from '../components/Alert';

const CheckoutPage = () => {
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: '123 Innovation Way',
    city: 'San Francisco',
    postalCode: '94105',
    country: 'United States',
  });

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [isMockPayment, setIsMockPayment] = useState(true);
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    const setupPayment = async () => {
      if (cartItems.length === 0) return;

      setLoadingIntent(true);
      setError(null);
      try {
        const config = await paymentService.getPaymentConfig();
        const publishableKey =
          config.publishableKey ||
          import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
          'pk_test_placeholder';

        if (publishableKey && !publishableKey.includes('placeholder')) {
          setStripePromise(loadStripe(publishableKey));
        }

        const res = await paymentService.createPaymentIntent(totalPrice);
        if (res && res.clientSecret) {
          setClientSecret(res.clientSecret);
          setIsMockPayment(!!res.isMock);
        }
      } catch (err) {
        console.warn('Payment setup notice:', err.message);
        setIsMockPayment(true);
        setClientSecret(`mock_sec_${Date.now()}`);
      } finally {
        setLoadingIntent(false);
      }
    };

    setupPayment();
  }, [totalPrice, cartItems.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: paymentResult.paymentMethod || 'Stripe',
        paymentResult,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const res = await orderService.createOrder(orderData);

      if (res && res.order) {
        clearCart();
        navigate(`/order/${res.order._id}/confirmation`, {
          state: { order: res.order },
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to place order record after payment'
      );
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          to="/cart"
          className="p-2 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Checkout & Payment
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Complete your delivery information and payment details
          </p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Shipping Address Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Shipping Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 742 Evergreen Terrace"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. San Francisco"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Postal / ZIP Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 94105"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. United States"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Processing */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Payment Information
              </h2>
            </div>

            {loadingIntent ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-200 dark:border-indigo-950 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Connecting to secure gateway...</p>
              </div>
            ) : stripePromise && !isMockPayment ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm
                  clientSecret={clientSecret}
                  isMock={false}
                  amount={totalPrice}
                  shippingAddress={shippingAddress}
                  user={user}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            ) : (
              <StripePaymentForm
                clientSecret={clientSecret}
                isMock={true}
                amount={totalPrice}
                shippingAddress={shippingAddress}
                user={user}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Your Order</h2>

          {/* Items Preview */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover bg-gray-100 dark:bg-slate-800 shrink-0 border border-gray-100 dark:border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-2.5 text-xs text-gray-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-semibold text-gray-900 dark:text-white">${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax (8%)</span>
              <span className="font-semibold text-gray-900 dark:text-white">${taxPrice.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-slate-800 pt-3 flex justify-between text-base font-black text-gray-900 dark:text-white">
              <span>Total Due</span>
              <span className="text-xl text-indigo-600 dark:text-indigo-400">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Buyer Protection Included
            </div>
            <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-500">
              Your transaction is covered under our 30-day money-back guarantee and verified SSL encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
