import API from './api';

export const orderService = {
  // Create an order after successful payment
  async createOrder(orderData) {
    const response = await API.post('/api/orders', orderData);
    return response.data;
  },

  // Get current user's past orders
  async getMyOrders() {
    const response = await API.get('/api/orders/myorders');
    return response.data;
  },

  // Get specific order by ID
  async getOrderById(id) {
    const response = await API.get(`/api/orders/${id}`);
    return response.data;
  },

  // Admin: Get all orders across the store
  async getAllOrders() {
    const response = await API.get('/api/orders');
    return response.data;
  },

  // Admin: Mark order as delivered
  async updateOrderToDelivered(id) {
    const response = await API.put(`/api/orders/${id}/deliver`);
    return response.data;
  },
};

export default orderService;
