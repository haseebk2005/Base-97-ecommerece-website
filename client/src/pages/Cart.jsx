// client/src/pages/Cart.jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { motion } from 'framer-motion';

export default function Cart() {
  const { cartItems, removeItem, addItem, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  console.log(cartItems)
  const updateQty = (id, qty) => {
    const item = cartItems.find((x) => x.product === id);
    addItem({ ...item, qty });
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  const itemsPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + shippingPrice ;

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const normalizeImage = (img) => {
    if (!img) return '';
    return img.startsWith('/uploads')
      ? `http://localhost:5000${img}`
      : img;
  };

  return (
    <motion.div
      className="min-h-screen mt-20 px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Shopping Cart
          </h2>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-xl font-medium text-gray-700 mb-3">
                Your Cart is Empty
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-2 px-6 py-3 bg-[#3c9aab] text-white rounded-lg hover:bg-blue-600 transition"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-100 p-4 rounded-t-lg">
                <div className="col-span-5 font-medium text-gray-600">
                  Product
                </div>
                <div className="col-span-2 font-medium text-gray-600">
                  Size
                </div>
                <div className="col-span-3 font-medium text-gray-600">
                  Quantity
                </div>
                <div className="col-span-2 font-medium text-right text-gray-600">
                  Price
                </div>
              </div>

              <div className="bg-white rounded-b-lg shadow divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.product}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4"
                    variants={itemVariants}
                  >
                    {/* Product Info */}
                    <div className="col-span-5 flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={normalizeImage(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-800 truncate">
                        {item.name}
                      </span>
                    </div>

                    {/* Selected Size */}
                    <div className="col-span-2 text-gray-700">
                      {item.size}
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-3 flex items-center">
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(item.product, Math.max(1, item.qty - 1))
                        }
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-l transition"
                      >
                        –
                      </button>
                      <span className="px-4 py-1 border-t border-b border-gray-200 text-center w-12">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(
                            item.product,
                            Math.min(item.countInStock, item.qty + 1)
                          )
                        }
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-r transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div className="col-span-2 flex items-center justify-between md:justify-end">
                      <div className="text-gray-800 font-medium">
                        PKR {(item.price * item.qty).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(item.product)}
                        className="text-red-500 hover:text-red-600 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                <button
                  onClick={clearCart}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto px-6 py-3 bg-white border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </motion.div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <motion.div
            className="bg-white rounded-lg shadow p-6 sticky top-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Order Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items)
                </span>
                <span className="text-gray-800">
                  PKR {itemsPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">
                  {shippingPrice === 0 ? 'FREE' : `PKR ${shippingPrice.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-4 mt-2">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-blue-600">
                  PKR {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={proceedToCheckout}
              className="mt-6 w-full py-3 bg-[#3c9aab] text-white rounded-lg font-medium hover:transition"
            >
              Proceed to Checkout
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
