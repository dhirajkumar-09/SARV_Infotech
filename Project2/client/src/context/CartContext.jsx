import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Sync cart items to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }, [cartItems]);

  // Add item to cart or increment quantity if already present
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      const stock = product.stock !== undefined ? product.stock : 99;

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, stock),
              }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            _id: product._id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            stock: stock,
            category: product.category,
            quantity: Math.min(quantity, stock),
          },
        ];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === productId) {
          const maxAllowed = item.stock || 99;
          return {
            ...item,
            quantity: Math.min(Math.max(1, quantity), maxAllowed),
          };
        }
        return item;
      })
    );
  };

  // Remove single item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Calculated figures
  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const rawItemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const itemsPrice = parseFloat(rawItemsPrice.toFixed(2));

  // Free shipping on orders over $100
  const shippingPrice = cartItems.length === 0 ? 0 : itemsPrice > 100 ? 0 : 10.0;

  // Estimated 8% sales tax
  const taxPrice = parseFloat((itemsPrice * 0.08).toFixed(2));

  // Overall total
  const totalPrice = parseFloat(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
