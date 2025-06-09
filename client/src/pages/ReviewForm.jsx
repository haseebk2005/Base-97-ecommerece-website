import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewForm() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productId: '', rating: 5, comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Load product list for dropdown
  useEffect(() => {
    axios.get(`${API_URL}/api/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const submit = async e => {
    e.preventDefault();
    setError(''); 
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/reviews`, form, config);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  // Star rating component
  const StarRating = () => {
    return (
      <div className="flex items-center mb-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setForm({ ...form, rating: star })}
              className="text-2xl focus:outline-none"
            >
              {star <= form.rating ? (
                <span className="text-yellow-400">★</span>
              ) : (
                <span className="text-gray-300">☆</span>
              )}
            </button>
          ))}
        </div>
        <span className="ml-2 text-gray-600">
          {form.rating} Star{form.rating > 1 ? 's' : ''}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#3c9aab] mt-20 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Form Header */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
          <h2 className="text-2xl font-bold">Share Your Experience</h2>
          <p className="text-indigo-100 mt-1">
            Your feedback helps us improve our products
          </p>
        </div>
        
        {/* Success Message */}
        {success && (
          <motion.div 
            className="bg-green-100 border-l-4 border-green-500 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700 font-medium">
                Review submitted! Thank you for your feedback.
              </p>
            </div>
          </motion.div>
        )}
        
        {/* Form Content */}
        <form onSubmit={submit} className="p-6">
          {error && (
            <motion.div 
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Select Product
            </label>
            <div className="relative">
              <select
                required
                value={form.productId}
                onChange={e => setForm({ ...form, productId: e.target.value })}
                className="className='text-black' w-full px-4 py-3 bg-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                disabled={loading}
              >
                <option value="" className='text-black'>-- Choose a product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Your Rating
            </label>
            <StarRating />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">
              Your Review
            </label>
            <textarea
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Tell us about your experience with this product..."
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Share details about what you liked, disliked, and overall experience
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
              loading || success 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-b from-gray-900 to-gray-800 text-white hover:to-[#3c9aab] shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : success ? (
              'Submitted Successfully!'
            ) : (
              'Submit Review'
            )}
          </button>
        </form>
        
        {/* Form Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p className="text-gray-500 text-sm text-center">
            Your review will be publicly visible after moderation
          </p>
        </div>
      </motion.div>
    </div>
  );
}