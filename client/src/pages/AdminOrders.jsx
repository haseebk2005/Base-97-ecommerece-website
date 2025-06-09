// client/src/pages/AdminOrders.jsx

import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext.jsx';
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Track which order is selected for the modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch all orders with user info
  useEffect(() => {
    axios.get(`${API_URL}/api/orders`, config)
      .then(res => setOrders(res.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Update order status both in the list and (if open) in the modal
  const updateStatus = async (id, newStatus) => {
    try {
      // Backend route: PUT /api/admin/orders/:id/status
      const { data } = await axios.put(
        `${API_URL}/api/admin/orders/${id}/status`,
        { status: newStatus },
        config
      );
      setOrders(prev => prev.map(o => o.id === data.id ? data : o));

      // If the modal is open for this same order, refresh it too
      if (selectedOrder?.id === data.id) {
        setSelectedOrder(data);
      }
    } catch (err) {
      console.error('Full error response:', err.response);
      alert('Status update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="w-16 h-16 border-4 border-[#3c9aab] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <p className="text-red-400 text-xl p-6 bg-gray-800/70 rounded-xl max-w-md text-center">
          {error}
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br mt-20 from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Management</h1>
            <p className="text-gray-400">Manage customer orders and fulfillment</p>
          </header>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
            {/* ---------- Desktop Table ---------- */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead className="bg-[#3c9aab]">
                  <tr>
                    {[
                      'Order ID',
                      'Customer',
                      'Contact',
                      'Shipping Address',
                      'Amount',
                      'Status',
                      'Actions'
                    ].map(h => (
                      <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`border-b border-gray-700/50 ${
                        index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/10'
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4 font-mono text-sm text-[#3c9aab]">#{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{order.User?.name || '—'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">{order.User?.email || '—'}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        {order.shippingAddress ? (
                          <div className="text-gray-300 text-sm">
                            <div>{order.shippingAddress.address}</div>
                            <div>
                              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                            </div>
                            <div>{order.shippingAddress.country}</div>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="bg-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#3c9aab] outline-none transition w-full"
                          value={order.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateStatus(order.id, e.target.value)}
                        >
                          {['Pending', 'Paid', 'Dispatched', 'Delivered', 'Cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            updateStatus(order.id, order.status);
                          }}
                          className="bg-[#3c9aab] hover:bg-[#2a7a8a] px-4 py-2 rounded-lg transition duration-300"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ---------- Mobile Cards ---------- */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 transition hover:bg-gray-800/70 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-mono text-[#3c9aab] text-sm">
                        #{order.id}
                      </div>
                      <h3 className="font-bold text-lg">{order.User?.name || '—'}</h3>
                    </div>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="text-sm">
                      <div className="text-gray-400">Contact</div>
                      <div>{order.User?.email || '—'}</div>
                    </div>

                    <div className="text-sm">
                      <div className="text-gray-400">Shipping</div>
                      {order.shippingAddress ? (
                        <div className="text-gray-200">
                          <div>{order.shippingAddress.address}</div>
                          <div>
                            {order.shippingAddress.city}, {order.shippingAddress.country}
                          </div>
                        </div>
                      ) : '—'}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <select
                        className="bg-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#3c9aab] outline-none transition flex-1"
                        value={order.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => updateStatus(order.id, e.target.value)}
                      >
                        {['Pending', 'Paid', 'Dispatched', 'Delivered', 'Cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          updateStatus(order.id, order.status);
                        }}
                        className="bg-[#3c9aab] hover:bg-[#2a7a8a] px-4 py-2 rounded-lg transition"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---------- MODAL OVERLAY ---------- */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/80 bg-opacity-60 flex items-center justify-center"
        >
          <div
            className="bg-gray-800 text-white rounded-lg p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto relative"
          >
            {/* Close (×) */}
            <button
              className="absolute top-3 right-3 text-2xl font-bold text-gray-200 hover:text-white"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>

            {/* ====== MODAL CONTENT: Essential Details in a Table ====== */}
            <h2 className="text-2xl font-semibold mb-4">
              Order #{selectedOrder.id} Details
            </h2>

            {/* --- ESSENTIAL INFO TABLE --- */}
            <table className="w-full table-auto mb-6 text-sm border-collapse">
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-2 font-medium text-gray-300">Customer</td>
                  <td className="px-4 py-2">{selectedOrder.User?.name || '—'}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-2 font-medium text-gray-300">Email</td>
                  <td className="px-4 py-2">{selectedOrder.User?.email || '—'}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-2 font-medium text-gray-300">Shipping Address</td>
                  <td className="px-4 py-2">
                    {selectedOrder.shippingAddress
                      ? `${selectedOrder.shippingAddress.address}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.postalCode}, ${selectedOrder.shippingAddress.country}`
                      : '—'}
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-2 font-medium text-gray-300">Payment Method</td>
                  <td className="px-4 py-2">{selectedOrder.paymentMethod || '—'}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-2 font-medium text-gray-300">Order Total</td>
                  <td className="px-4 py-2">${selectedOrder.totalPrice.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-2 font-medium text-gray-300">Status</td>
                  <td className="px-4 py-2">{selectedOrder.status}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-2 font-medium text-gray-300">Is Paid</td>
                  <td className="px-4 py-2">{selectedOrder.isPaid ? 'Yes' : 'No'}</td>
                </tr>
                {selectedOrder.isPaid && (
                  <tr className="border-b border-gray-700">
                    <td className="px-4 py-2 font-medium text-gray-300">Paid At</td>
                    <td className="px-4 py-2">{new Date(selectedOrder.paidAt).toLocaleString()}</td>
                  </tr>
                )}
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-2 font-medium text-gray-300">Created At</td>
                  <td className="px-4 py-2">{new Date(selectedOrder.createdAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* --- ORDER ITEMS TABLE --- */}
            {Array.isArray(selectedOrder.OrderItems) && selectedOrder.OrderItems.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mb-2">Order Items</h3>
                <table className="w-full table-auto text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.OrderItems.map(item => (
                      <tr key={item.id} className="border-b border-gray-700">
                        <td className="px-4 py-2">{item.Product?.name || '—'}</td>
                        <td className="px-4 py-2">{item.qty}</td>
                        <td className="px-4 py-2">PKR {item.price.toFixed(2)}</td>
                        <td className="px-4 py-2">{item.Product?.category || '—'}</td>
                        <td className="px-4 py-2">{item.size || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}  
    </>
  );
}
