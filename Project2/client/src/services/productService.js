import API from './api';

export const productService = {
  // Fetch products with optional keyword, category, price range, and sort
  async getProducts(params = {}) {
    const response = await API.get('/api/products', { params });
    return response.data;
  },

  // Fetch unique categories list
  async getCategories() {
    const response = await API.get('/api/products/categories');
    return response.data;
  },

  // Fetch single product details by ID
  async getProductById(id) {
    const response = await API.get(`/api/products/${id}`);
    return response.data;
  },

  // Admin: Create new product
  async createProduct(productData) {
    const response = await API.post('/api/products', productData);
    return response.data;
  },

  // Admin: Update product
  async updateProduct(id, productData) {
    const response = await API.put(`/api/products/${id}`, productData);
    return response.data;
  },

  // Admin: Delete product
  async deleteProduct(id) {
    const response = await API.delete(`/api/products/${id}`);
    return response.data;
  },
};

export default productService;
