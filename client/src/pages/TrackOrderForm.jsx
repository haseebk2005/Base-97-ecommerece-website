import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TrackOrderForm() {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = e => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter a valid order ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      navigate(`/track/${orderId.trim()}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen mt-20 bg-[#3c9aab]/60 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Form Header with Theme Color */}
        <div className="bg-[#3c9aab] p-6 text-white">
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white/20 p-3 rounded-full mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center">Track Your Order</h2>
            <p className="text-center text-white/90 mt-2">
              Enter your order ID to check the status of your purchase
            </p>
          </motion.div>
        </div>
        
        {/* Form Content */}
        <form onSubmit={submit} className="p-6 md:p-8">
          {error && (
            <motion.div 
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}
          
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-gray-700 font-medium mb-3">
              Order ID
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 123456"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3c9aab] focus:border-[#3c9aab] text-lg text-black"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" 
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              You can find your order ID in your confirmation email
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-medium text-white text-lg transition-all shadow-lg ${
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
                  Tracking Order...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Track Order
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="ml-3 h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" 
                    />
                  </svg>
                </span>
              )}
            </button>
          </motion.div>
        </form>
        
        {/* Additional Help Section */}
        <div className="bg-gray-50 px-6 py-6 border-t border-gray-100">
          <motion.h3 
            className="text-lg font-medium text-gray-800 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Need help with your order?
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="bg-[#3c9aab]/10 p-2 rounded-full mr-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-[#3c9aab]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Contact Support</h4>
                <p className="text-sm text-gray-500 mt-1">24/7 customer service</p>
                <p className="text-sm text-[#3c9aab] font-medium mt-2">support@fitgear.com</p>
              </div>
            </div>
            
            <div className="flex items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="bg-[#3c9aab]/10 p-2 rounded-full mr-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-[#3c9aab]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Live Chat</h4>
                <p className="text-sm text-gray-500 mt-1">Instant messaging support</p>
                <p className="text-sm text-[#3c9aab] font-medium mt-2">Chat now →</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}