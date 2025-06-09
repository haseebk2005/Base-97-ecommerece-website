// client/src/pages/ProductsFilter.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTh, FaList, FaChevronDown, FaChevronUp, FaStar, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function ProductnFilter() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState({
    price: true,
    category: true,
    size: true
  });
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    category: '',
    size: ''
  });
  const [sortBy, setSortBy] = useState('none');
  const [viewMode, setViewMode] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(9);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL; // e.g. https://api-your-app.onrender.com

  // Fetch products
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/products`)
      .then(res => {
        setAllProducts(res.data);
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err.response?.data || err.message);
        setLoading(false);
      });
  }, []);

  // Filter + Sort
  useEffect(() => {
    let filtered = allProducts.filter(p =>
      p.price >= filters.minPrice && p.price <= filters.maxPrice &&
      (!filters.category || p.category === filters.category) &&
      (!filters.size || (Array.isArray(p.sizes) && p.sizes.includes(filters.size)))
    );

    if (sortBy === 'priceAsc')   filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'priceDesc')  filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest')     filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setProducts(filtered);
    setVisibleCount(9);
  }, [allProducts, filters, sortBy]);

  const categories = Array.isArray(allProducts)
    ? [...new Set(allProducts.map(p => p.category))].filter(Boolean)
    : [];
  const sizes = Array.isArray(allProducts)
    ? [...new Set(allProducts.flatMap(p => Array.isArray(p.sizes) ? p.sizes : []))].filter(Boolean)
    : [];

  const resetFilters = () => {
    setFilters({ minPrice: 0, maxPrice: 10000, category: '', size: '' });
    setSortBy('none');
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      {/* Promo Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-4 md:p-6 bg-[#3c9aab] rounded-xl text-white text-center shadow-lg"
      >
        <h2 className="text-xl md:text-2xl font-bold">
          Use Affiliate link to get 5% off Now
        </h2>
        <p className="mt-2 text-sm md:text-base">
          Get your <Link to="affiliate/request" className="font-semibold underline hover:text-blue-200">
            Affiliate link
          </Link> now
        </p>
      </motion.div>

      {/* Mobile Filters Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileFiltersOpen(o => !o)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-800 text-white rounded-lg font-medium"
        >
          <FaFilter /> {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-full lg:w-72 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Filters</h3>
            <button onClick={resetFilters} className="text-sm text-white hover:text-black">
              Reset All
            </button>
          </div>

          {[{ key: 'price', label: 'Price Range' }, { key: 'category', label: 'Category' }, { key: 'size', label: 'Size' }].map(sec => (
            <div key={sec.key} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <button
                onClick={() => setFiltersOpen(f => ({ ...f, [sec.key]: !f[sec.key] }))}
                className="w-full flex justify-between items-center font-medium text-gray-700"
              >
                <span className="font-semibold">{sec.label}</span>
                {filtersOpen[sec.key] ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <AnimatePresence>
                {filtersOpen[sec.key] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-4 space-y-3"
                  >
                    {sec.key === 'price' && (
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                            <input
                              type="number" min="0"
                              value={filters.minPrice}
                              onChange={e => setFilters(f => ({ ...f, minPrice: +e.target.value }))}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                            <input
                              type="number" min="0"
                              value={filters.maxPrice}
                              onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>
                        <input
                          type="range" min="0" max="10000"
                          value={filters.maxPrice}
                          onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))}
                          className="w-full"
                        />
                      </div>
                    )}
                    {sec.key === 'category' && (
                      <div className="space-y-2">
                        <button
                          onClick={() => setFilters(f => ({ ...f, category: '' }))}
                          className={`w-full text-left px-3 py-2 rounded-lg ${!filters.category ? 'bg-blue-100 text-[#3c9aab] font-medium' : 'hover:bg-gray-100'}`}
                        >
                          All Categories
                        </button>
                        {categories.map(c => (
                          <button
                            key={c}
                            onClick={() => setFilters(f => ({ ...f, category: c }))}
                            className={`w-full text-left px-3 py-2 rounded-lg ${filters.category === c ? 'bg-blue-100 text-[#3c9aab] font-medium' : 'hover:bg-gray-100'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                    {sec.key === 'size' && (
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setFilters(f => ({ ...f, size: '' }))}
                          className={`py-2 rounded-lg ${!filters.size ? 'bg-blue-100 text-[#3c9aab] font-medium' : 'hover:bg-gray-100'}`}
                        >
                          All
                        </button>
                        {sizes.map(s => (
                          <button
                            key={s}
                            onClick={() => setFilters(f => ({ ...f, size: s }))}
                            className={`py-2 rounded-lg ${filters.size === s ? 'bg-blue-100 text-[#3c9aab] font-medium' : 'hover:bg-gray-100'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Sort & View */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h4 className="font-semibold text-gray-700 mb-3">Sort & View</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="none">— None —</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">View Mode</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${viewMode === 'grid' ? 'bg-blue-100 text-[#3c9aab]' : 'bg-gray-100'}`}
                  >
                    <FaTh /> Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${viewMode === 'list' ? 'bg-blue-100 text-[#3c9aab]' : 'bg-gray-100'}`}
                  >
                    <FaList /> List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filters */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white rounded-xl shadow-lg p-5 mb-6"
            >
              {/* …same filter UI as desktop but mobile‐optimized… */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products */}
        <section className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3c9aab]" />
            </div>
          ) : (
            <>
              <div className={`${viewMode==='grid'?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3':'grid grid-cols-1'} gap-5`}>
                {Array.isArray(products) && products.slice(0, visibleCount).map((p, idx) => (
                  <motion.div
                    key={p.id}
                    className="overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    {p.price < 50 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Sale
                      </span>
                    )}
                    <ProductCard product={p} viewMode={viewMode} />
                    {p.rating != null && (
                      <div className="px-4 pb-3 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) =>
                          <FaStar key={i} size={14}
                            className={i < Math.round(p.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                        )}
                        <span className="text-xs text-gray-500 ml-2">({p.reviews ?? 0})</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {visibleCount < products.length && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setVisibleCount(c => c + 6)}
                    className="px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition transform hover:-translate-y-0.5"
                  >
                    Load More Products
                  </button>
                </div>
              )}

              {Array.isArray(products) && products.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">😕</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                  <button onClick={resetFilters} className="px-6 py-2.5 bg-[#3c9aab] text-white rounded-lg font-medium">
                    Reset All Filters
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
