// src/pages/admin/AdminEdit.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext.jsx';

export default function AdminEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const SIZE_OPTIONS = ['SM', 'MD', 'LG', 'XL', '2XL', '3XL', '4XL'];

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    sizes: [],
    countInStock: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Fetch existing product
  useEffect(() => {
    document.body.classList.add('bg-gray-900');
    return () => document.body.classList.remove('bg-gray-900');
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.image,
          category: data.category,
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
          countInStock: data.countInStock,
        });
        setFetchError('');
      } catch (err) {
        console.error('Fetch error:', err);
        setFetchError('Could not load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'countInStock'
          ? (value === '' ? '' : Number(value))
          : value,
    }));
  };

  const handleSizeToggle = (size) => {
    setProduct((prev) => {
      const hasSize = prev.sizes.includes(size);
      const updated = hasSize
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updated };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSaving(true);

    try {
      let imageUrl = product.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        };
        const { data } = await axios.post('/api/upload', formData, uploadConfig);
        imageUrl = data.url;
      }

      const productData = { ...product, image: imageUrl, sizes: product.sizes };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/products/${id}`, productData, config);
      navigate('/admin');
    } catch (err) {
      console.error('Update error:', err);
      setSubmitError(err.response?.data?.message || err.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <motion.p
        className="p-6 text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading product…
      </motion.p>
    );
  }

  if (fetchError) {
    return (
      <div className="p-6 text-red-600">
        {fetchError}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-3 py-1 bg-gray-200 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

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
              Edit Product
            </h2>
            <p className="text-gray-400 mt-2">
              Modify product details
            </p>
          </div>

          {submitError && (
            <motion.div
              className="mb-6 p-3 bg-red-900/50 text-red-300 rounded-lg border border-red-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {submitError}
            </motion.div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Name', name: 'name', type: 'text', required: true },
                { label: 'Category', name: 'category', type: 'text', required: true },
                {
                  label: 'Price ($)',
                  name: 'price',
                  type: 'number',
                  step: '0.01',
                  required: true,
                },
                {
                  label: 'Stock Quantity',
                  name: 'countInStock',
                  type: 'number',
                  required: true,
                },
              ].map((field) => (
                <div key={field.name}>
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
                />
                <p className="text-xs text-gray-400 mt-1">
                  Choose a new JPG/PNG to replace the current image.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-[#3c9aab] hover:bg-[#2a7a8b] text-white font-medium rounded-lg shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {saving ? (
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
                    Saving Product...
                  </span>
                ) : (
                  'Save Product'
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
          <p>Ensure all fields are filled correctly before saving</p>
        </div>
      </div>
    </motion.div>
  );
}
