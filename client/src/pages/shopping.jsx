// client/src/pages/ShoppingPage.jsx
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ProductCardS from '../components/ProductCardShopping.jsx';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaFilter, 
  FaTh, 
  FaList, 
  FaSearch, 
  FaTimes,
  FaStar,
  FaFire
} from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import Footer from '../components/Footer.jsx';

export default function ShoppingPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState({ price: false, size: false });
  const [filters, setFilters] = useState({ 
    category: '', 
    minPrice: 0, 
    maxPrice: 10000, 
    size: '' 
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const mobileFiltersRef = useRef(null);

  // Fetch products & categories
  useEffect(() => {
    setLoading(true);
    axios.get('/api/products')
      .then(res => {
        setAllProducts(res.data);
        setProducts(res.data);
        const cats = [...new Set(res.data.map(p => p.category))].filter(Boolean);
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter & sort logic
  useEffect(() => {
    let filtered = allProducts
      .filter(p => (filters.category ? p.category === filters.category : true))
      .filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice)
      .filter(p => (filters.size ? Array.isArray(p.sizes) && p.sizes.includes(filters.size) : true))
      .filter(p => 
        searchQuery 
          ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );

    if (sortBy === 'priceAsc') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'priceDesc') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === 'featured') filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
    if (sortBy === 'popular') filtered.sort((a, b) => b.popularity - a.popularity);

    setProducts(filtered);
    setVisibleCount(12);
  }, [allProducts, filters, sortBy, searchQuery]);

  const resetFilters = () => {
    setFilters({ category: '', minPrice: 0, maxPrice: 10000, size: '' });
    setSearchQuery('');
  };

  // Close mobile filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileFiltersOpen && mobileFiltersRef.current && !mobileFiltersRef.current.contains(e.target)) {
        setMobileFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileFiltersOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mt-10 mb-4">Premium Collection</h1>
        <p className="text-xl max-w-2xl mx-auto mb-8 ">
          Discover our curated selection of high-quality products designed for your lifestyle
        </p>
        <div className="max-w-xl mx-auto relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full py-3 px-4 pr-12 rounded-full text-white shadow-lg"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
              {/* Promo Banner */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 md:p-6 bg-[#3c9aab] text-white text-center shadow-lg"
              >
                <h2 className="text-xl md:text-2xl font-bold">Use Affiliate link to get 5% off Now</h2>
                <p className="mt-2 text-sm md:text-base">
                  Get your <Link to={'/affiliate/request'} className="font-semibold underline hover:text-blue-200 transition">Affiliate link</Link> now
                </p>
              </motion.div>
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Top Bar - Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden  flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow border"
            >
              <FaFilter /> Filters
            </button>
            
            <div className="hidden md:flex items-center gap-2">
              <span className="font-medium text-white">Filter by:</span>
              <select
                value={filters.category}
                onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                className="bg-white px-3 py-2 rounded-lg border"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-white hidden sm:block">
              {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white px-3 py-2 rounded-lg border"
              >
                <option value="featured">Featured</option>
                <option value="popular">Popularity</option>
                <option value="newest">Newest Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
            
            <div className="hidden md:flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filters Panel */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              ref={mobileFiltersRef}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl p-6 overflow-y-auto md:hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Filters</h3>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFilters(f => ({ ...f, category: '' }))}
                    className={`px-3 py-2 rounded-lg text-left ${!filters.category ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters(f => ({ ...f, category: cat }))}
                      className={`px-3 py-2 rounded-lg text-left ${filters.category === cat ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Min Price ($)</label>
                    <input
                      type="number" 
                      min="0"
                      value={filters.minPrice}
                      onChange={e => setFilters(f => ({ ...f, minPrice: +e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Max Price ($)</label>
                    <input
                      type="number" 
                      min="0"
                      value={filters.maxPrice}
                      onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {['sm','md','lg','xl','2xl', '3xl', '4xl'].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setFilters(f => ({ ...f, size: sz }))}
                      className={`w-12 h-10 flex items-center justify-center rounded-lg border ${filters.size === sz ? 'bg-blue-500 text-white border-blue-500' : 'bg-white hover:bg-gray-50'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2 px-4 bg-gray-100 rounded-lg flex items-center justify-center gap-2"
                >
                  <FiRefreshCw /> Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Panel */}
          <aside className="hidden md:block w-full lg:w-72 bg-white p-6 rounded-xl shadow-sm h-fit">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Filters</h3>
              <button 
                onClick={resetFilters}
                className="text-blue-600 flex items-center gap-1"
              >
                <FiRefreshCw size={14} /> Reset
              </button>
            </div>

            <div className="mb-8">
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setFilters(f => ({ ...f, category: '' }))}
                  className={`w-full px-4 py-3 rounded-lg text-left flex justify-between ${!filters.category ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  <span>All Categories</span>
                  <span className="text-gray-500">{allProducts.length}</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilters(f => ({ ...f, category: cat }))}
                    className={`w-full px-4 py-3 rounded-lg text-left flex justify-between ${filters.category === cat ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-50'}`}
                  >
                    <span>{cat}</span>
                    <span className="text-gray-500">
                      {allProducts.filter(p => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Price Range</h4>
                <span className="text-sm text-gray-500">${filters.minPrice} - ${filters.maxPrice}</span>
              </div>
              <div className="space-y-4">
                <div className="relative pt-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    value={filters.maxPrice}
                    onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Min ($)</label>
                    <input
                      type="number" 
                      min="0"
                      value={filters.minPrice}
                      onChange={e => setFilters(f => ({ ...f, minPrice: +e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Max ($)</label>
                    <input
                      type="number" 
                      min="0"
                      value={filters.maxPrice}
                      onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-medium mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {['sm','md','lg','xl','2xl','3xl','4xl'].map(sz => (
                  <button
                    key={sz}
                    onClick={() => setFilters(f => ({ ...f, size: sz }))}
                    className={`w-12 h-10 flex items-center justify-center rounded-lg border ${filters.size === sz ? 'bg-blue-500 text-white border-blue-500' : 'bg-white hover:bg-gray-50'}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
        </aside>

          {/* Products Display */}
          <section className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow overflow-hidden animate-pulse">
                    <div className="bg-gray-200 h-48 w-full" />
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3' : 'space-y-6'} gap-6`}>
                  {products.slice(0, visibleCount).map((p, i) => (
                    <motion.div 
                      key={p.id} 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.05 }}
                    >
                      <ProductCardS product={p} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </div>

                {visibleCount < products.length && (
                  <div className="mt-12 text-center">
                    <button 
                      onClick={() => setVisibleCount(c => c + 12)} 
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">😕</div>
                <h3 className="text-2xl font-bold mb-2">No Products Found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  We couldn't find any products matching your filters. Try adjusting your search criteria.
                </p>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer/>
    </div>
  );
}