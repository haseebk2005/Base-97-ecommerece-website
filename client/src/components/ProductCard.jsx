// client/src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const API_URL = import.meta.env.VITE_API_URL; // ✅ Use env variable

export default function ProductCard({ product }) {
  // If `product.image` is a relative path (e.g. "/uploads/1623456789012_myfile.png"),
  // prepend our local API URL. Otherwise (e.g. if it's already absolute), use as-is.
  const imageSrc =
    product.image && product.image.startsWith('/uploads')
      ? `http://localhost:5000${product.image}`
      : product.image;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-transparent text-black border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/product/${product.id}`}>
        <motion.img
          src={imageSrc}
          alt={product.name}
          className="h-48 w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
        <div className="p-4">
          <motion.h3
            className="text-lg font-semibold mb-2 hover:text-gray-600 transition-colors"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            {product.name}
          </motion.h3>
          <motion.p
            className="text-sm font-medium"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.1 }}
          >
            PKR {product.price.toFixed(2)}
          </motion.p>
        </div>
      </Link>
    </motion.div>
  );
}
