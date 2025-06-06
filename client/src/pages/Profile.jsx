import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import axios from 'axios';
import { motion } from 'framer-motion';
import Footer from '../components/Footer.jsx';

export default function Profile() {
  const { user, token, logout } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '',contact: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, contact: user.contact, password: '' });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/orders/myorders', config);
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setMessage('Failed to load order history');
    } finally {
      setLoadingOrders(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('/api/users/profile', form, config);
      setMessage('Profile updated. Please log in again.');
      setTimeout(() => logout(), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };


  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const baseStyle = "px-2 py-1 rounded-full text-xs font-medium";
    switch(status) {
      case 'Paid':
        return `${baseStyle} bg-green-900 text-green-200`;
      case 'Dispatched':
        return `${baseStyle} bg-blue-900 text-blue-200`;
      case 'Delivered':
        return `${baseStyle} bg-[#10b981] text-blue-200`;
      case 'Cancelled':
        return `${baseStyle} bg-red-900 text-red-200`;
      default: // Pending
        return `${baseStyle} bg-yellow-900 text-yellow-200`;
    }
  };

  return (
    <motion.div
      className="min-h-screen mt-20 bg-[#3c9aab]/60 p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 w-full md:w-1/4">
            <div className="flex items-center gap-4 mb-6">
              <div>
                <h1 className="text-xl font-bold">{user?.name}</h1>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left p-3 rounded-lg transition ${
                  activeTab === 'profile' 
                    ? 'bg-[#3c9aab] text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                Profile Information
              </button>
              
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left p-3 rounded-lg transition ${
                  activeTab === 'orders' 
                    ? 'bg-[#3c9aab] text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                Order History
              </button>
            </div>
            
            <button 
              onClick={logout}
              className="w-full mt-8 p-3 flex items-center gap-2 justify-center text-[#21bad5] hover:text-white hover:bg-gray-700 rounded-lg transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Sign Out
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-[#3c9aab]">
                {activeTab === 'profile' ? 'Profile Settings' : 'Order History'}
              </h2>
              <div className="bg-gray-900 rounded-lg px-3 py-1 text-sm">
              {!user.isAdmin ? <i>User</i> : 'Admin'}
              </div>
            </div>

            {message && (
              <motion.div 
                className={`mb-6 p-3 rounded-lg ${
                  message.includes('failed') 
                    ? 'bg-red-900 text-red-200' 
                    : 'bg-green-900 text-green-200'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {message}
              </motion.div>
            )}

            {activeTab === 'profile' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={submit} className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Name</label>
                    <div className="p-3 bg-gray-900 rounded-lg mb-4">
                      {user?.name || 'Not available'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Email</label>
                    <div className="p-3 bg-gray-900 rounded-lg mb-4">
                      {user?.email || 'Not available'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Contact</label>
                    <div className="p-3 bg-gray-900 rounded-lg mb-4">
                      {user?.contact || 'Not available'}
                    </div>
                  </div>



                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 rounded-lg font-medium transition ${
                        isSubmitting
                          ? 'bg-gray-700 cursor-not-allowed'
                          : 'bg-[#3c9aab] hover:bg-[#2a7a8a]'
                      }`}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {loadingOrders ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3c9aab]"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-900 p-6 rounded-xl inline-block">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 className="text-xl font-medium mb-2">No Orders Found</h3>
                      <p className="text-gray-400">You haven't placed any orders yet</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-750">
                            <td className="px-4 py-4 text-sm font-medium text-[#3c9aab]">
                              #{order.id}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-300">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium">
                              PKR {order.totalPrice}
                            </td>
                            <td className="px-4 py-4">
                              <span className={getStatusBadge(order.status)}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-300">
                              {order.paymentMethod}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
      <Footer/>
          </div>
        </div>
      </div>
    </motion.div>
  );
}