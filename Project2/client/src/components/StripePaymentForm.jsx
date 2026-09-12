import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Shield, Lock, CreditCard, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Alert from './Alert';

const StripePaymentForm = ({
  clientSecret,
  isMock,
  amount,
  shippingAddress,
  user,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { isDark } = useTheme();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const cardElementOptions = {
    style: {
      base: {
        color: isDark ? '#f8fafc' : '#1e293b',
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '15px',
        '::placeholder': {
          color: isDark ? '#64748b' : '#94a3b8',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);

    try {
      if (isMock || !stripe || !elements) {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        onSuccess({
          id: `demo_stripe_${Date.now()}`,
          status: 'succeeded',
          update_time: new Date().toISOString(),
          email_address: user?.email,
          paymentMethod: 'Stripe Card',
        });
        return;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card input element not loaded');
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: shippingAddress.fullName,
              email: user.email,
              address: {
                line1: shippingAddress.address,
                city: shippingAddress.city,
                postal_code: shippingAddress.postalCode,
                country: shippingAddress.country || 'US',
              },
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess({
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: user?.email,
          paymentMethod: 'Stripe Card',
        });
      } else {
        setError('Payment could not be completed. Please try again.');
        setProcessing(false);
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      {isMock && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Secure Test Environment:</strong> No real charges will be made. Use the test card below to complete your order.
          </span>
        </div>
      )}

      {/* Card Input Box */}
      <div className="border border-gray-300 dark:border-slate-700 rounded-2xl p-4 bg-white dark:bg-slate-950 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900 transition shadow-sm">
        <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Credit or Debit Card
        </label>
        <div className="py-1">
          <CardElement key={isDark ? 'dark' : 'light'} options={cardElementOptions} />
        </div>
      </div>

      {/* Stripe Test Card Reference */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
          <CreditCard className="w-3.5 h-3.5" /> Test Card:
        </span>
        <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100">
          4242 4242 4242 4242
        </span>
        <span className="text-slate-500 dark:text-slate-400">Exp: 12/28 • CVC: 123</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processing}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing Payment...</span>
          </div>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Pay ${Number(amount).toFixed(2)} Securely</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 dark:text-slate-500 flex items-center justify-center gap-1">
        <Shield className="w-3.5 h-3.5 text-emerald-600" /> End-to-end 256-bit encrypted via Stripe
      </p>
    </form>
  );
};

export default StripePaymentForm;
