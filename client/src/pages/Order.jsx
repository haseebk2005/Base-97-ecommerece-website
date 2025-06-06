// client/src/pages/Order.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import CartContext from '../context/CartContext';
import Footer from '../components/Footer.jsx';
import { motion } from 'framer-motion';

export default function Order() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        console.error('Order fetch error:', err.response?.data || err.message);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, token]);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : '—';

  const StatusBadge = ({ label, success }) => (
    <span
      className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${
        success ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
      }`}
    >
      {label}
    </span>
  );

  const normalizeImage = (img) => {
    if (!img) return '';
    return img.startsWith('/uploads') ? `http://localhost:5000${img}` : img;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#205f6b]">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto rounded-full bg-[#3c9aab] opacity-20 mb-4"></div>
          <p className="text-[#3c9aab]">Loading order details...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#205f6b]">
        <p className="text-red-600 bg-red-50 p-6 rounded-xl max-w-md text-center">
          {error}
        </p>
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#205f6b]">
        <p className="text-gray-700 bg-gray-50 p-6 rounded-xl max-w-md text-center">
          Order not found
        </p>
      </div>
    );

  const items = order.orderItems ?? order.OrderItems ?? [];

  const handleReorder = () => {
    items.forEach((item) => {
      const productId = item.product || item.Product?.id;
      const name = item.Product?.name || item.name || 'Unnamed Product';
      const image = item.Product?.image || item.image || '';
      const price = item.price ?? 0;
      const countInStock =
        item.Product?.countInStock ?? item.countInStock ?? item.qty ?? 1;
      const qty = item.qty ?? 1;
      const size = item.size || item.size || '—';

      addItem({
        product: productId,
        name,
        image,
        price,
        countInStock,
        qty,
        size,
      });
    });
    navigate('/cart');
  };

  return (
    <>
      <div className="min-h-screen mt-20 bg-[#205f6b] pt-4 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-[#d7f0f5]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#3c9aab]">
                Order #{order.id}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-start">
              <StatusBadge
                label={
                  order.isDelivered
                    ? `Delivered at ${formatDate(order.deliveredAt)}`
                    : 'Processing'
                }
                success={order.isDelivered}
              />
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping */}
                <div className="bg-white rounded-xl shadow-sm p-5 border border-[#d7f0f5]">
                  <div className="flex items-center mb-4 pb-2 border-b border-[#d7f0f5]">
                    <div className="bg-[#e6f7fb] p-2 rounded-lg mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#3c9aab]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#3c9aab]">
                      Shipping Address
                    </h3>
                  </div>
                  {order.shippingAddress ? (
                    <div className="text-gray-700 space-y-2">
                      <p className="font-medium">
                        {order.shippingAddress.fullName}
                      </p>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && (
                        <p className="mt-3 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-[#3c9aab]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {order.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No shipping address</p>
                  )}
                </div>

                {/* Payment */}
                <div className="bg-white rounded-xl shadow-sm p-5 border border-[#d7f0f5]">
                  <div className="flex items-center mb-4 pb-2 border-b border-[#d7f0f5]">
                    <div className="bg-[#e6f7fb] p-2 rounded-lg mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#3c9aab]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path
                          fillRule="evenodd"
                          d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#3c9aab]">
                      Payment Method
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Method</p>
                      <p className="font-medium text-black">
                        {order.paymentMethod === 'COD'
                          ? 'Cash on Delivery'
                          : 'Jazz Cash/ EasyPaisa/ Bank Account'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <StatusBadge
                        label={
                          order.isPaid
                            ? `Paid at ${formatDate(order.paidAt)}`
                            : 'Pending'
                        }
                        success={order.isPaid}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-sm p-5 border border-[#d7f0f5]">
                <div className="flex items-center mb-4 pb-2 border-b border-[#d7f0f5]">
                  <div className="bg-[#e6f7fb] p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#3c9aab]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#3c9aab]">
                    Order Items
                  </h3>
                </div>
                {items.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">
                    No items in this order
                  </p>
                ) : (
                  <ul className="divide-y divide-[#d7f0f5]">
                    {items.map((item) => (
                      <li key={item.id ?? item.product} className="py-4">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gray-200">
                              <img
                                src={normalizeImage(
                                  item.Product?.image || item.image
                                )}
                                alt={item.Product?.name || item.name || 'Product'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {item.Product?.name || item.name || 'Unnamed Product'}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Size: {item.size || '—'} | Qty: {item.qty ?? 0}
                            </p>
                          </div>
                          {/* Price & Subtotal */}
                          <div className="text-right">
                            <p className="font-medium text-gray-800">
                              PKR {item.price.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.qty} × {item.price.toFixed(2)} = PKR{' '}
                              {((item.qty ?? 0) * (item.price ?? 0)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-[#d7f0f5] sticky top-4">
                <div className="flex items-center mb-4 pb-2 border-b border-[#d7f0f5]">
                  <div className="bg-[#e6f7fb] p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#3c9aab]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#3c9aab]">
                    Order Summary
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-black">
                      PKR {order.itemsPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-black">
                      PKR {order.shippingPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between pt-3 mt-3 border-t border-[#d7f0f5] font-bold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-[#3c9aab] text-lg">
                      PKR {order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleReorder}
                  className="w-full mt-6 py-3 bg-[#3c9aab] text-white rounded-lg font-medium hover:bg-[#2a7d8c] transition"
                >
                  Reorder These Items
                </button>
                <div className="mt-8 pt-5 border-t border-[#d7f0f5]">
                  <h4 className="font-medium text-[#3c9aab] mb-3">
                    Need help with your order?
                  </h4>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-[#3c9aab]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href="tel:+923001234567">+92 300 1234567</a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-[#3c9aab]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <a href="mailto:support@example.com">support@example.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
