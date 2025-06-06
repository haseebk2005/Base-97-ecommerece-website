// client/src/pages/Product.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import CartContext from '../context/CartContext';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useContext(CartContext);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(''); // track size choice
  const nav = useNavigate();
  const { token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`/api/products/${id}`),
          axios.get(`/api/reviews/${id}`)
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const submitReview = async e => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setReviewLoading(true);
      await axios.post('/api/reviews', { productId: id, rating, comment }, config);
      const { data } = await axios.get(`/api/reviews/${id}`);
      setReviews(data);
      setComment('');
      setRating(5);
    } catch (err) {
      alert('Review error: ' + (err.response?.data?.message || err.message));
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAdd = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }
    addItem({
      product: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty,
      size: selectedSize,
    });
    nav('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-t-4 border-[#3c9aab] border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or may have been removed.
          </p>
          <button
            className="bg-[#3c9aab] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2a7d8c] transition"
            onClick={() => nav('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Normalize single image URL
  const normalizeImage = img => {
    if (!img) return '';
    return img.startsWith('/uploads') ? `http://localhost:5000${img}` : img;
  };

  return (
    <div className="bg-[#6c9aab]/100 min-h-screen">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <motion.div
              className="bg-white mt-20 rounded-2xl shadow-lg overflow-hidden mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src={normalizeImage(product.image)}
                alt={product.name}
                className="w-full h-96 object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </div>

          {/* Product Details */}
          <motion.div
            className="bg-white rounded-2xl mt-20 shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-[#3c9aab]/10 text-[#3c9aab] rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            <motion.h1
              className="text-3xl font-bold text-gray-900 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {product.name}
            </motion.h1>

            <div className="flex items-center mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < product.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 ml-2">({product.numReviews} reviews)</span>
            </div>

            <motion.p
              className="text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {product.description}
            </motion.p>

            <div className="mb-8">
              <div className="flex items-end mb-4">
                <span className="text-3xl font-bold text-[#3c9aab]">
                  PKR {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through ml-3">
                    PKR {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>Availability:</span>
                <span
                  className={`ml-2 font-medium ${
                    product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.countInStock > 0
                    ? `${product.countInStock} in stock`
                    : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Select Size:</label>
                <select
                  value={selectedSize}
                  onChange={e => setSelectedSize(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#3c9aab] focus:border-[#3c9aab]"
                  required
                >
                  <option value="" disabled>
                    -- Choose size --
                  </option>
                  {product.sizes.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {product.countInStock > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <motion.button
                      type="button"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      whileTap={{ scale: 0.95 }}
                    >
                      -
                    </motion.button>

                    <span className="px-4 py-2 w-16 text-center">{qty}</span>

                    <motion.button
                      type="button"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                      whileTap={{ scale: 0.95 }}
                    >
                      +
                    </motion.button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    onClick={handleAdd}
                    className="flex-1 py-3 bg-[#3c9aab] text-white rounded-lg font-medium hover:bg-[#2a7d8c] transition shadow-md disabled:opacity-50"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!selectedSize}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            ) : (
              <button
                className="w-full py-3 bg-gray-300 text-gray-700 rounded-lg font-medium cursor-not-allowed"
                disabled
              >
                Out of Stock
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <div className="flex items-center">
              <span className="text-gray-700 mr-2">Average Rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < product.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 font-bold">({product.rating})</span>
            </div>
          </div>

          {/* Review Form */}
          {token && (
            <motion.div
              className="bg-gray-50 rounded-xl p-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-medium text-gray-800 mb-4">Write a Review</h3>
              <form onSubmit={submitReview}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Your Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-2xl focus:outline-none"
                      >
                        {star <= rating ? (
                          <span className="text-yellow-400">★</span>
                        ) : (
                          <span className="text-gray-300">☆</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="comment" className="block text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c9aab] focus:border-[#3c9aab]"
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className={`px-6 py-3 bg-[#3c9aab] text-white rounded-lg font-medium hover:bg-[#2a7d8c] transition ${
                    reviewLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </motion.div>
          )}
          {/* Reviews List */}
          <div>
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Be the first to share your thoughts about this product!
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    className="border-b border-gray-200 pb-8 last:border-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start mb-4">
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-800">Anonymus</h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 ml-4">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
