// src/pages/admin/AdminCreate.jsx
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext.jsx';

export default function AdminCreate() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const SIZE_OPTIONS = ['SM', 'MD', 'LG', 'XL', '2XL', '3XL', '4XL'];

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    sizes: [],          // now an array
    countInStock: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'countInStock'
          ? Number(value)
          : value,
    }));
  };

  const handleSizeToggle = (size) => {
    setProduct((prev) => {
      const hasSize = prev.sizes.includes(size);
      const updatedSizes = hasSize
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        };

        const { data } = await axios.post(
          '/api/upload',
          formData,
          uploadConfig
        );
        imageUrl = data.url;
      }

      const productData = {
        ...product,
        image: imageUrl,
        sizes: product.sizes, // now already an array of strings
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      await axios.post('/api/products', productData, config);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Creation error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    document.body.classList.add('bg-gray-900');
    return () => document.body.classList.remove('bg-gray-900');
  }, []);

  return (
    <motion.div
      className="p-4 lg:p-6 min-h-screen flex mt-20 items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-2xl">
        <motion.div
          className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#3c9aab]">
              Create New Product
            </h2>
            <p className="text-gray-400 mt-2">
              Add a new product to your inventory
            </p>
          </div>

          {error && (
            <motion.div
              className="mb-6 p-3 bg-red-900/50 text-red-300 rounded-lg border border-red-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Product Name', name: 'name', type: 'text', required: true },
                { label: 'Category', name: 'category', type: 'text', required: true },
                {
                  label: 'Price ($)',
                  name: 'price',
                  type: 'number',
                  step: '0.01',
                  required: true,
                  className: 'md:col-span-1',
                },
                {
                  label: 'Stock Quantity',
                  name: 'countInStock',
                  type: 'number',
                  required: true,
                  className: 'md:col-span-1',
                },
              ].map((field) => (
                <div key={field.name} className={field.className || ''}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    step={field.step}
                    value={product[field.name]}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:border-[#3c9aab] focus:ring-2 focus:ring-[#3c9aab]/50 focus:outline-none transition"
                    required={field.required}
                  />
                </div>
              ))}

              {/* Sizes checkboxes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sizes
                </label>
                <div className="flex flex-wrap gap-4">
                  {SIZE_OPTIONS.map((size) => (
                    <label key={size} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={size}
                        checked={product.sizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                        className="form-checkbox h-5 w-5 text-[#3c9aab] bg-gray-700 border-gray-600 rounded focus:ring-[#3c9aab]/50 transition"
                      />
                      <span className="ml-2 text-gray-300">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description textarea */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:border-[#3c9aab] focus:ring-2 focus:ring-[#3c9aab]/50 focus:outline-none transition"
                  required
                ></textarea>
              </div>

              {/* File input for Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-gray-200 border border-gray-600 rounded-lg py-2 px-3 bg-gray-700 focus:border-[#3c9aab] focus:ring-2 focus:ring-[#3c9aab]/50 focus:outline-none transition"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Choose a JPG/PNG. It will be uploaded to /uploads and served from there.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#3c9aab] hover:bg-[#2a7a8b] text-white font-medium rounded-lg shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                    Creating Product...
                  </span>
                ) : (
                  'Create Product'
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate('/admin')}
                className="py-3 px-6 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Ensure all fields are filled correctly before submission</p>
        </div>
      </div>
    </motion.div>
  );
}
