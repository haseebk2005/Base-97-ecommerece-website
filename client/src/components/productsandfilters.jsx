// client/src/pages/Home.jsx
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

  // Fetch products
  useEffect(() => {
    setLoading(true);
    axios.get('/api/products')
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

  const categories = [...new Set(allProducts.map(p => p.category))].filter(Boolean);
  const sizes      = [...new Set(allProducts.flatMap(p => Array.isArray(p.sizes) ? p.sizes : []))].filter(Boolean);

  // Reset filters
  const resetFilters = () => {
    setFilters({ minPrice: 0, maxPrice: 1000, category: '', size: '' });
    setSortBy('none');
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 ">
      {/* Promo Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-4 md:p-6 bg-[#3c9aab] rounded-xl text-white text-center shadow-lg"
      >
        <h2 className="text-xl md:text-2xl font-bold">Use Affiliate link to get 5% off Now</h2>
        <p className="mt-2 text-sm md:text-base">
          Get your <Link to={'affiliate/request'} className="font-semibold underline hover:text-blue-200 transition">Affiliate link</Link> now
        </p>
      </motion.div>
    
      {/* Mobile Filters Button */}
      <div className="lg:hidden mb-6">
        <button 
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-800 text-white rounded-lg font-medium"
        >
          <FaFilter /> {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <aside className="hidden lg:block w-full lg:w-72 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Filters</h3>
            <button 
              onClick={resetFilters}
              className="text-sm text-[#ffffff] hover:text-black font-medium"
            >
              Reset All
            </button>
          </div>

          {[
            { key: 'price',   label: 'Price Range'   },
            { key: 'category',label: 'Category'      },
            { key: 'size',    label: 'Size'          }
          ].map(section => (
            <div key={section.key} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <button
                onClick={() => setFiltersOpen(f => ({ ...f, [section.key]: !f[section.key] }))}
                className="w-full flex justify-between items-center font-medium text-gray-700"
              >
                <span className="font-semibold">{section.label}</span>
                {filtersOpen[section.key] ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              <AnimatePresence>
                {filtersOpen[section.key] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {section.key === 'price' && (
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
                                type="number" min="0" max={200}
                                value={filters.maxPrice}
                                onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg "
                              />
                            </div>
                          </div>
                          <div className="pt-2">
                            <input 
                              type="range" 
                              min="0" 
                              max="10000" 
                              value={filters.maxPrice}
                              onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                      {section.key === 'category' && (
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
                      {section.key === 'size' && (
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Sort & View - Desktop */}
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-[#3c9aab] hover:text-[#3c9aab] font-medium"
                >
                  Reset All
                </button>
              </div>

              {[
                { key: 'price',   label: 'Price Range'   },
                { key: 'category',label: 'Category'      },
                { key: 'size',    label: 'Size'          }
              ].map(section => (
                <div key={section.key} className="mb-4">
                  <button
                    onClick={() => setFiltersOpen(f => ({ ...f, [section.key]: !f[section.key] }))}
                    className="w-full flex justify-between items-center py-3 font-medium text-gray-700"
                  >
                    <span className="font-semibold">{section.label}</span>
                    {filtersOpen[section.key] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  {filtersOpen[section.key] && (
                    <div className="mt-2 mb-4 pl-2">
                      {section.key === 'price' && (
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
                        </div>
                      )}
                      {section.key === 'category' && (
                        <div className="space-y-2">
                          <select
                            value={filters.category}
                            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      )}
                      {section.key === 'size' && (
                        <div className="grid grid-cols-3 gap-2">
                          {sizes.map(s => (
                            <button
                              key={s}
                              onClick={() => setFilters(f => ({ ...f, size: s }))}
                              className={`py-2 rounded-lg ${filters.size === s ? 'bg-blue-100 text-[#3c9aab] font-medium' : 'bg-gray-100'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-4">
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products */}
        <section className="flex-1">
          {/* Sort & View Controls - Mobile */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              {products.length} products found
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-[#3c9aab]' : 'bg-gray-100'}`}
              >
                <FaTh />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              >
                <FaList />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3c9aab]"></div>
            </div>
          )}

          {/* Products Grid/List */}
          {!loading && (
            <>
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid grid-cols-1'} gap-5`}>
                {products.slice(0, visibleCount).map((p, idx) => (
                  <motion.div
                    key={p.id}
                    className="overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Sale Badge */}
                    {p.price < 50 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Sale
                      </span>
                    )}

                    <ProductCard product={p} viewMode={viewMode} />

                    {/* Rating */}
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

              {/* Load More */}
              {visibleCount < products.length && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setVisibleCount(vc => vc + 6)}
                    className="px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition transform hover:-translate-y-0.5"
                  >
                    Load More Products
                  </button>
                </div>
              )}

              {/* No Results */}
              {products.length === 0 && !loading && (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">😕</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 bg-[#3c9aab] text-white rounded-lg font-medium hover:bg-[#3c9aab] transition"
                  >
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