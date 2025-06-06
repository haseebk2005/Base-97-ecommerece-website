// client/src/context/CartContext.jsx
import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext({
  cartItems: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }) => {
  // 1) On first load, try to read from localStorage. If it exists, parse it; otherwise default to an empty array.
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = window.localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Could not parse cartItems from localStorage', err);
      return [];
    }
  });

  // 2) Whenever cartItems changes, write the updated array back into localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Could not save cartItems to localStorage', err);
    }
  }, [cartItems]);

  // 3) addItem: If an item with the same product ID AND size already exists, update its qty; otherwise push a new entry.
  const addItem = (newItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.product === newItem.product && ci.size === newItem.size
      );

      if (existingIndex !== -1) {
        // Already in cart with same size → increment quantity (but cap at countInStock)
        const updated = [...prev];
        const existing = updated[existingIndex];
        const desiredQty = existing.qty + newItem.qty;
        updated[existingIndex] = {
          ...existing,
          qty: Math.min(desiredQty, existing.countInStock),
        };
        return updated;
      } else {
        // Not yet in cart → add as new entry
        return [...prev, { ...newItem }];
      }
    });
  };

  // 4) removeItem: Remove a product-size combination from cart
  const removeItem = (productId, size) => {
    setCartItems((prev) =>
      prev.filter((ci) => !(ci.product === productId && ci.size === size))
    );
  };

  // 5) clearCart: Wipe everything out
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
