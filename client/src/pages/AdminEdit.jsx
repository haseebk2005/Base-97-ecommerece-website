// src/pages/admin/AdminEdit.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
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
        console.error(err);
        setFetchError('Could not load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
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

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSaving(true);
    try {
      await axios.put(
        `/api/products/${id}`,
        {
          ...product,
          sizes: product.sizes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || err.message);
    }
    setSaving(false);
  };

  if (loading) return <p className="p-6">Loading product…</p>;
  if (fetchError)
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

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">Edit Product</h2>
      <form onSubmit={submitHandler} className="space-y-4">
        {[
          { label: 'Name', name: 'name', value: product.name, type: 'text' },
          {
            label: 'Description',
            name: 'description',
            value: product.description,
            type: 'text',
          },
          { label: 'Image URL', name: 'image', value: product.image, type: 'text' },
          { label: 'Category', name: 'category', value: product.category, type: 'text' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-medium">{field.label}</label>
            <input
              name={field.name}
              type={field.type}
              value={field.value}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}

        {/* Sizes checkboxes */}
        <div>
          <label className="block font-medium mb-2">Sizes</label>
          <div className="flex flex-wrap gap-4">
            {SIZE_OPTIONS.map((size) => (
              <label key={size} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={size}
                  checked={product.sizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                  className="form-checkbox h-5 w-5 text-[#3c9aab] bg-white border-gray-600 rounded focus:ring-[#3c9aab]/50 transition"
                />
                <span className="ml-2">{size}</span>
              </label>
            ))}
          </div>
        </div>

        {[
          {
            label: 'Price ($)',
            name: 'price',
            value: product.price,
            type: 'number',
            step: '0.01',
            min: 0,
          },
          {
            label: 'In Stock',
            name: 'countInStock',
            value: product.countInStock,
            type: 'number',
            min: 0,
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-medium">{field.label}</label>
            <input
              name={field.name}
              type={field.type}
              step={field.step}
              min={field.min}
              value={field.value}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}

        {submitError && <div className="text-red-600">{submitError}</div>}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
