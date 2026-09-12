const { sampleProducts, sampleUsers } = require('./sampleData');

// In-memory mock store that activates when MongoDB is not running locally
class MockStore {
  constructor() {
    this.products = JSON.parse(JSON.stringify(sampleProducts));
    this.users = JSON.parse(JSON.stringify(sampleUsers));
    this.orders = [];
  }

  // Find products with query filters
  getProducts({ keyword, category, minPrice, maxPrice, sortBy, page = 1, limit = 12 }) {
    let result = [...this.products];

    if (keyword && keyword.trim()) {
      const kw = keyword.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.category.toLowerCase().includes(kw)
      );
    }

    if (category && category.toLowerCase() !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (minPrice !== undefined && minPrice !== '') {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Default: newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = result.length;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;
    const paginated = result.slice(skip, skip + limitNum);

    return {
      products: paginated,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      count: paginated.length,
    };
  }

  getCategories() {
    const cats = [...new Set(this.products.map((p) => p.category))];
    return cats.sort();
  }

  getProductById(id) {
    return this.products.find((p) => p._id.toString() === id.toString());
  }

  createProduct(data) {
    const newProduct = {
      _id: `mock_prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...data,
      rating: 4.5,
      numReviews: 0,
      createdAt: new Date().toISOString(),
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id, data) {
    const index = this.products.findIndex((p) => p._id.toString() === id.toString());
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...data };
    return this.products[index];
  }

  deleteProduct(id) {
    const index = this.products.findIndex((p) => p._id.toString() === id.toString());
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  // Users
  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find((u) => u._id.toString() === id.toString());
  }

  createUser(data) {
    const newUser = {
      _id: `mock_user_${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role || 'user',
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // Orders
  createOrder(data, user) {
    const order = {
      _id: `mock_order_${Date.now()}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      ...data,
      isPaid: true,
      paidAt: new Date().toISOString(),
      isDelivered: false,
      createdAt: new Date().toISOString(),
    };

    // Deduct stock
    for (const item of data.orderItems || []) {
      const prod = this.getProductById(item.product || item._id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
      }
    }

    this.orders.unshift(order);
    return order;
  }

  getUserOrders(userId) {
    return this.orders.filter(
      (o) => o.user._id.toString() === userId.toString()
    );
  }

  getOrderById(id) {
    return this.orders.find((o) => o._id.toString() === id.toString());
  }

  getAllOrders() {
    return [...this.orders];
  }
}

const mockStore = new MockStore();
module.exports = mockStore;
