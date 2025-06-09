import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const API_URL = import.meta.env.VITE_API_URL;

// Simple SVG components for heart and star icons
const HeartIcon = ({ size = 18, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const StarIcon = ({ filled = false, size = 14, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export default function ProductCard({ product }) {
  const imageSrc =
    product.image && product.image.startsWith('/uploads')
      ? `${API_URL}${product.image}`
      : product.image;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
      boxShadow:
        '0 12px 20px -5px rgba(0, 0, 0, 0.3), 0 6px 10px -6px rgba(0, 0, 0, 0.4)',
    },
  };

  const rating = Math.round(product.Review?.rating || 4);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 text-gray-100 relative"
    >
      

      <Link to={`/product/${product.id}`} className="block">
        <motion.img
          src={imageSrc}
          alt={product.name}
          className="h-56 w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />

        <div className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <motion.h3
              className="text-xl font-bold hover:text-blue-400 transition-colors"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              {product.name}
            </motion.h3>
            {/* Rating */}
            <div className="flex items-center space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  filled={i < rating}
                  className={i < rating ? 'text-yellow-400' : 'text-gray-600'}
                />
              ))}
            </div>
          </div>

          <motion.p
            className="text-lg font-semibold"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.1 }}
          >
            PKR {product.price.toFixed(2)}
          </motion.p>

          {/* Call to Action */}
          <div className="mt-3">
            <button className="w-full py-2 border border-blue-500 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
