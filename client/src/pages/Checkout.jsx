// client/src/pages/Checkout.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { motion } from 'framer-motion';
const API_URL = import.meta.env.VITE_API_URL; // ✅ Use env variable

export default function Checkout() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);

  const [address, setAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [affiliateCode, setAffiliateCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Calculate prices
  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + shippingPrice;

  // Helper to normalize image URLs
  const normalizeImage = (img) => {
    if (!img) return '';
    return img.startsWith('/uploads')
      ? `${API_URL}${img}`
      : img;
  };

  const submitHandler = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          qty:     item.qty,
          price:   item.price,
          size:    item.size
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice
      };
      if (affiliateCode.trim()) {
        payload.affiliateCode = affiliateCode.trim().toUpperCase();
      }

      const { data: order } = await axios.post(
        '/api/orders',
        payload,
        config
      );

      clearCart();
      navigate(`/order/${order.id}`);
    } catch (err) {
      console.error('Order creation error:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen mt-20 bg-[#3c9aab]/60 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Shipping & Payment Section */}
          <motion.div
            className="w-full md:w-7/12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Shipping Information
              </h2>

              <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Street Address</label>
                    <input
                      placeholder="123 Main St"
                      value={address.address}
                      onChange={e => setAddress({ ...address, address: e.target.value })}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c9aab] focus:border-[#3c9aab]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input
                      placeholder="New York"
                      value={address.city}
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c9aab] focus:border-[#3c9aab]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Postal Code</label>
                    <input
                      placeholder="10001"
                      value={address.postalCode}
                      onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c9aab] focus:border-[#3c9aab]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Country</label>
                    <input
                      placeholder="United States"
                      value={address.country}
                      onChange={e => setAddress({ ...address, country: e.target.value })}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c9aab] focus:border-[#3c9aab]"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-gray-700 mb-2">Affiliate Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter your affiliate code"
                    value={affiliateCode}
                    onChange={e => setAffiliateCode(e.target.value)}
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c9aab] focus:border-[#3c9aab]"
                  />
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-[#3c9aab] bg-[#3c9aab]/10'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setPaymentMethod('COD')}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full border mr-3 ${
                            paymentMethod === 'COD'
                              ? 'border-[#3c9aab] bg-[#3c9aab]'
                              : 'border-gray-400'
                          }`}
                        ></div>
                        <div>
                          <h4 className="font-medium text-gray-800">Cash on Delivery</h4>
                          <p className="text-sm text-gray-600">Pay when you receive</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'Card'
                          ? 'border-[#3c9aab] bg-[#3c9aab]/10'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setPaymentMethod('Card')}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full border mr-3 ${
                            paymentMethod === 'Card'
                              ? 'border-[#3c9aab] bg-[#3c9aab]'
                              : 'border-gray-400'
                          }`}
                        ></div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Jazz Cash / EasyPaisa / Bank Account
                          </h4>
                          <p className="text-sm text-gray-600">Share screenshots with us.</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <p className="text-red-700">{error}</p>
                  </motion.div>
                )}

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#3c9aab] hover:bg-[#2a7d8c] hover:shadow-xl'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing Order...
                      </span>
                    ) : paymentMethod === 'COD' ? (
                      `Pay PKR ${totalPrice.toFixed(2)} on Delivery`
                    ) : (
                      'Pay with Raast'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="w-full md:w-5/12"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center border-b border-gray-100 pb-4"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={normalizeImage(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-800 truncate">
                        {item.name}
                      </h4>
                      <div className="mt-1 text-gray-600">
                        <span>Size: {item.size}</span>
                        <span className="mx-2">|</span>
                        <span>Qty: {item.qty}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-800">
                        PKR {(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">PKR {itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">
                    PKR {shippingPrice.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-[#3c9aab]">
                    PKR {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-[#3c9aab]/10 border border-[#3c9aab]/30 rounded-lg p-4">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#3c9aab] mt-0.5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-[#3c9aab] text-sm">
                    Your order total includes all applicable duties and taxes. No additional charges at delivery.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
