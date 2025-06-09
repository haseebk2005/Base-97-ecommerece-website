import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
const API_URL = import.meta.env.VITE_API_URL;

export default function TrackOrder() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${API_URL}/api/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, token]);

  // Status icons and colors
  const getStatusInfo = (status) => {
    switch(status) {
      case 'Processing':
        return { icon: '🔄', color: '#3c9aab', progress: 25 };
      case 'Shipped':
        return { icon: '🚚', color: '#3c9aab', progress: 50 };
      case 'Dispatched':
        return { icon: '📦', color: '#3c9aab', progress: 75 };
      case 'Delivered':
        return { icon: '✅', color: '#10b981', progress: 100 };
      case 'Cancelled':
        return { icon: '❌', color: '#ef4444', progress: 0 };
      default:
        return { icon: '⏳', color: '#3c9aab', progress: 10 };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-t-4 border-[#3c9aab] border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3c9aab]/60 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            className="bg-[#3c9aab] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2a7d8c] transition"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find an order with ID: {id}</p>
          <a 
            href="/" 
            className="inline-block bg-[#3c9aab] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2a7d8c] transition"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  
  return (
    <div className="min-h-screen mt-20 bg-[#3c9aab]/50 py-12 px-4">
      <motion.div 
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3c9aab] to-[#2a7d8c] p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Order #{order.id}</h1>
              <p className="mt-1 ">Track your order status</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full">
                <span className="text-xl mr-2">{statusInfo.icon}</span>
                <span className="font-medium">{order.status}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>Order Placed</span>
            <span>Delivered</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#3c9aab]"
              initial={{ width: 0 }}
              animate={{ width: `${statusInfo.progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            ></motion.div>
          </div>
        </div>
        
        {/* Order Timeline */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Timeline</h2>
          
          <div className="relative pl-8 border-l-2 border-[#3c9aab]/30">
            {/* Order Created */}
            <div className="mb-8 relative">
              <div className="absolute -left-11 w-8 h-8 rounded-full bg-[#3c9aab] flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Order Placed</h3>
                <p className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Your order has been received</p>
              </div>
            </div>
            
            {/* Payment */}
            {order.paidAt && (
              <div className="mb-8 relative">
                <div className="absolute -left-11 w-8 h-8 rounded-full bg-[#3c9aab] flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Payment Confirmed</h3>
                  <p className="text-gray-600">{new Date(order.paidAt).toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">Payment processed successfully</p>
                </div>
              </div>
            )}
            
            {/* Processing */}
            {order.status !== 'Cancelled' && (
              <div className="mb-8 relative">
                <div className={`absolute -left-11 w-8 h-8 rounded-full ${
                  order.status === 'Processing' ? 'bg-[#3c9aab]' : 'bg-gray-300'
                } flex items-center justify-center`}>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Processing Order</h3>
                  <p className="text-sm text-gray-500 mt-1">Preparing your items for shipment</p>
                </div>
              </div>
            )}
            
            {/* Shipping */}
            {(order.status === 'Shipped' || order.status === 'Dispatched' || order.status === 'Delivered') && (
              <div className="mb-8 relative">
                <div className="absolute -left-11 w-8 h-8 rounded-full bg-[#3c9aab] flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Shipped</h3>
                  <p className="text-sm text-gray-500 mt-1">Your order is on its way</p>
                </div>
              </div>
            )}
            
            {/* Delivery */}
            {order.deliveredAt && (
              <div className="relative">
                <div className="absolute -left-11 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Delivered</h3>
                  <p className="text-gray-600">{new Date(order.deliveredAt).toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">Your order has been delivered</p>
                </div>
              </div>
            )}
            
            {/* Cancelled */}
            {order.status === 'Cancelled' && (
              <div className="relative">
                <div className="absolute -left-11 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Order Cancelled</h3>
                  <p className="text-sm text-gray-500 mt-1">This order has been cancelled</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
                <p className="text-gray-600">
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
                <p className="text-gray-600">
                  {order.paymentMethod}<br />
                  {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
            <Link to={"/Shopping"}>
            <button className="px-6 py-3 bg-[#3c9aab] text-white rounded-lg font-medium hover:bg-[#2a7d8c] transition">
              Continue Shopping
            </button>
            </Link>
          </div>
        </div>
      </motion.div>
      
      {/* Support Section */}
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Need Help With Your Order?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start p-4 bg-gray-50 rounded-lg">
            <div className="bg-[#3c9aab]/10 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3c9aab]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Call Support</h3>
              <p className="text-gray-600"><a href='tel:+92'>+1 (800) 555-1234</a></p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-gray-50 rounded-lg">
            <div className="bg-[#3c9aab]/10 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3c9aab]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Email Us</h3>
              <p className="text-gray-600"><a href='mailto:g@g.c'>support@fitgear.com</a></p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-gray-50 rounded-lg">
            <div className="bg-[#3c9aab]/10 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3c9aab]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Live Chat</h3>
              <p className="text-gray-600">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}