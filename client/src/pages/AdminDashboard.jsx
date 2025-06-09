// client/src/pages/AdminDashboard.jsx

import { useEffect, useState, useContext, useRef } from 'react';
import axios                                from 'axios';
import { Link }                             from 'react-router-dom';
import { motion }                           from 'framer-motion';
import Chart                                from 'chart.js/auto';
import AuthContext                          from '../context/AuthContext.jsx';
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [metrics, setMetrics]   = useState(null);
  const [products, setProducts] = useState([]);
  const salesChartRef           = useRef(null);
  const salesChartInstance      = useRef(null);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  // 1) Fetch dashboard metrics
  useEffect(() => {
    axios.get(`${API_URL}/api/admin/metrics`, config)
      .then(res => setMetrics(res.data))
      .catch(err => console.error('Metrics fetch error:', err));
  }, [token]);

  // 2) Render (and clean up) sales chart once metrics arrive
  useEffect(() => {
    if (!metrics) return;

    if (salesChartInstance.current) {
      salesChartInstance.current.destroy();
    }

    const ctx = salesChartRef.current.getContext('2d');
    salesChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: metrics.sales.map(s => s.date),
        datasets: [{
          label: 'Sales (USD)',
          data: metrics.sales.map(s => s.salesUSD),
          fill: false,
          borderColor: '#3c9aab',
          backgroundColor: '#3c9aab55',
          tension: 0.4,
          pointBackgroundColor: '#3c9aab',
          pointBorderColor: '#ffffff',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { 
            beginAtZero: true,
            grid: { color: '#374151' },
            ticks: { color: '#9ca3af' }
          },
          x: {
            grid: { color: '#374151' },
            ticks: { color: '#9ca3af' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#d1d5db' }
          }
        }
      }
    });

    return () => {
      if (salesChartInstance.current) {
        salesChartInstance.current.destroy();
      }
    };
  }, [metrics]);

  // 3) Also load products for the table
  useEffect(() => {
    axios.get(`${API_URL}/api/products`, config)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Products fetch error:', err));
  }, [token]);

  const deleteProduct = async id => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`${API_URL}/api/products/${id}`, config);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (!metrics) {
    return (
      <motion.div
        className="p-6 text-gray-100 bg-gray-900 min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p>Loading dashboard…</p>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="p-4 lg:p-6 text-gray-100 bg-gray-900 mt-20 min-h-screen space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-[#3c9aab] text-center py-2">Admin Dashboard</h2>

      {/* 1. Order Status Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {[
          { label: 'Total Orders',   value: metrics.total },
          { label: 'Pending',        value: metrics.pending },
          { label: 'Paid',           value: metrics.paid },
          { label: 'Delivered',      value: metrics.delivered },
          { label: 'Cancelled',      value: metrics.cancelled }
        ].map((m, i) => (
          <motion.div 
            key={i}
            className="p-3 bg-gray-800 rounded-lg shadow-md flex flex-col items-center border-t-4 border-[#3c9aab]"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-xs md:text-sm text-gray-300">{m.label}</p>
            <p className="text-xl md:text-2xl font-bold mt-1">{m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 2. Sales Over Time Chart */}
      <div className="bg-gray-800 p-3 md:p-4 rounded-lg shadow-md">
        <h3 className="text-lg md:text-xl mb-3">Sales (Last 30 Days)</h3>
        <div className="h-64 md:h-80 w-full">
          <canvas ref={salesChartRef}></canvas>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center md:justify-end">
        <Link
          to="/admin/create"
          className="bg-[#3c9aab] hover:bg-[#2a7a8b] text-white px-4 py-2 rounded-lg transition-all shadow-md"
        >
          + Create Product
        </Link>
        <Link
          to="/admin/affiliates"
          className="bg-[#3c9aab] hover:bg-[#2a7a8b] text-white px-4 py-2 rounded-lg transition-all shadow-md"
        >
          Affiliate Requests
        </Link>
        <Link
          to="/admin/customers"
          className="bg-[#3c9aab] hover:bg-[#2a7a8b] text-white px-4 py-2 rounded-lg transition-all shadow-md"
        >
          Manage Customers
        </Link>
        <Link
          to="/admin/orders"
          className="bg-[#3c9aab] hover:bg-[#2a7a8b] text-white px-4 py-2 rounded-lg transition-all shadow-md"
        >
          Manage Orders
        </Link>
        <Link
          to="/admin/reviews"
          className="bg-[#3c9aab] hover:bg-[#2a7a8b] text-white px-4 py-2 rounded-lg transition-all shadow-md"
        >
          View Reviews
        </Link>
      </div>

      {/* 4. Product Management Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full table-auto border-collapse text-left bg-gray-800">
          <thead>
            <tr className="bg-[#3c9aab] bg-opacity-20">
              <th className="p-3 text-sm md:text-base">ID</th>
              <th className="p-3 text-sm md:text-base">Name</th>
              <th className="p-3 text-sm md:text-base">Price (USD)</th>
              <th className="p-3 text-sm md:text-base">Stock</th>
              <th className="p-3 text-sm md:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                <td className="p-3 text-xs md:text-sm">{p.id}</td>
                <td className="p-3 max-w-[150px] md:max-w-xs truncate">{p.name}</td>
                <td className="p-3">${p.price}</td>
                <td className={`p-3 font-medium ${p.countInStock < 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {p.countInStock}
                </td>
                <td className="p-3 space-x-2">
                  <Link
                    to={`/admin/edit/${p.id}`}
                    className="text-[#3c9aab] hover:text-[#2a7a8b] font-medium text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-500 hover:text-red-400 font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}