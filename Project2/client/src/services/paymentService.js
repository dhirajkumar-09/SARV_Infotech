import API from './api';

export const paymentService = {
  // Get Stripe publishable key configuration
  async getPaymentConfig() {
    const response = await API.get('/api/payment/config');
    return response.data;
  },

  // Create payment intent on server
  async createPaymentIntent(amount) {
    const response = await API.post('/api/payment/create-payment-intent', {
      amount,
    });
    return response.data;
  },
};

export default paymentService;
