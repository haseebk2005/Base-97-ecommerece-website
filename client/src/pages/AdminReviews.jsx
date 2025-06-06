import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

export default function AdminReviews() {
  const { token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios.get('/api/admin/reviews', config)
      .then(res => setReviews(res.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const deleteReview = async id => {
    try {
      await axios.delete(`/api/reviews/${id}`, config);
      setReviews(prev => prev.filter(r => r.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-16 h-16 border-4 border-[#3c9aab] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <p className="text-red-400 text-xl p-6 bg-gray-800/70 rounded-xl max-w-md text-center">
        {error}
      </p>
    </div>
  );

  return (
    <motion.div
      className="min-h-screen mt-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Customer Reviews</h1>
          <p className="text-gray-400">Manage all product reviews</p>
        </header>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead className="bg-[#3c9aab]">
                <tr>
                  {['ID', 'Product', 'User', 'Rating', 'Comment', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, index) => (
                  <tr 
                    key={review.id} 
                    className={`border-b border-gray-700/50 ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/10'}`}
                  >
                    <td className="px-6 py-4 font-mono text-sm text-[#3c9aab]">#{review.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {/* {review.Product?.name || '—'} */}
                        <span className="text-gray-400">(ID: {review.productId})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{review.User?.name || '—'}</div>
                      <div className="text-gray-400 text-sm">{review.User?.email || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1 text-lg">★</span>
                        <span className="font-medium">{review.rating}</span>
                        <span className="text-gray-400 ml-1">/5</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="text-gray-300 line-clamp-2">{review.comment}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setConfirmDelete(review.id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden grid grid-cols-1 gap-4 p-4">
            {reviews.map(review => (
              <div 
                key={review.id} 
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 transition hover:bg-gray-800/70"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-[#3c9aab] text-sm">#{review.id}</div>
                    <h3 className="font-bold text-lg">
                      {/* {review.Product?.name || 'Product'} */}
                      <span className="text-gray-400 text-sm ml-2">(ID: {review.productId})</span>
                    </h3>
                  </div>
                  <div className="flex items-center bg-gray-700 px-2 py-1 rounded-full">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>{review.rating}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="text-gray-400 text-sm">User</div>
                    <div className="font-medium">{review.User?.name || '—'}</div>
                    <div className="text-gray-400 text-sm">{review.User?.email || '—'}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-400 text-sm">Review</div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                  
                  <div>
                    <div className="text-gray-400 text-sm">Date</div>
                    <div className="text-gray-300 text-sm">
                      {new Date(review.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      onClick={() => setConfirmDelete(review.id)}
                      className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg transition"
                    >
                      Delete Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteReview(confirmDelete)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}