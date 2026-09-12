let stripe = null;

// Initialize Stripe if valid key is supplied
if (
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY.startsWith('sk_') &&
  !process.env.STRIPE_SECRET_KEY.includes('placeholder')
) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('[Stripe] Initialized with provided API key');
  } catch (err) {
    console.warn('[Stripe] Initialization error:', err.message);
  }
}

/**
 * @desc    Get Stripe publishable key configuration
 * @route   GET /api/payment/config
 * @access  Public
 */
const getPaymentConfig = async (req, res) => {
  const isStripeConfigured = Boolean(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SECRET_KEY.startsWith('sk_') &&
    !process.env.STRIPE_SECRET_KEY.includes('placeholder')
  );

  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    isConfigured: isStripeConfigured,
  });
};

/**
 * @desc    Create Stripe PaymentIntent for checkout
 * @route   POST /api/payment/create-payment-intent
 * @access  Private
 */
const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount',
      });
    }

    // Amount in cents for Stripe
    const amountInCents = Math.round(Number(amount) * 100);

    // If Stripe is configured with a valid live or test key
    if (stripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: currency.toLowerCase(),
          automatic_payment_methods: { enabled: true },
          metadata: {
            userId: req.user._id.toString(),
            userEmail: req.user.email,
          },
        });

        return res.json({
          success: true,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          isMock: false,
        });
      } catch (stripeError) {
        console.error('[Stripe Error]:', stripeError.message);
        // Fall back gracefully with helpful message
        return res.status(500).json({
          success: false,
          message: `Stripe error: ${stripeError.message}`,
        });
      }
    }

    // Demo/Sandbox fallback mode if Stripe keys are not yet configured
    const mockId = `pi_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return res.json({
      success: true,
      clientSecret: `${mockId}_secret_mock`,
      paymentIntentId: mockId,
      isMock: true,
      message: 'Demo payment mode active (Stripe API key not configured or in placeholder mode)',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPaymentConfig,
  createPaymentIntent,
};
