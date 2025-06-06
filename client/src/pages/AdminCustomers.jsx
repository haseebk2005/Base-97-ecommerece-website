// client/src/pages/AdminCustomers.jsx

import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext.jsx';

export default function AdminCustomers() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios.get('/api/admin/users', config)
      .then(res => setUsers(res.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt' 
      ? new Date(a[sortConfig.key]) 
      : a[sortConfig.key];
      
    const bValue = sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt' 
      ? new Date(b[sortConfig.key]) 
      : b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.contact && user.contact.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex  items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#3c9aab] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-8 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Customers</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#3c9aab] hover:bg-[#2a7a8b] text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-900 p-4 md:p-8 mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3c9aab]">Customer Management</h1>
          <p className="text-gray-400 mt-2">
            Manage all registered customers and their details
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search customers by name, email or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:border-[#3c9aab] focus:ring-2 focus:ring-[#3c9aab]/50 focus:outline-none"
              />
              <svg 
                className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="text-gray-300">
              Showing <span className="font-bold">{filteredUsers.length}</span> of <span className="font-bold">{users.length}</span> customers
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4 text-gray-600">👤</div>
            <h3 className="text-xl text-gray-300">No customers found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? 'Try a different search term' : 'No customers registered yet'}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#3c9aab] bg-opacity-20 text-left">
                    {[
                      { id: 'id', label: 'ID' },
                      { id: 'name', label: 'Name' },
                      { id: 'email', label: 'Email' },
                      { id: 'contact', label: 'Contact' },
                      { id: 'isAdmin', label: 'Admin' },
                      { id: 'affiliateUseCount', label: 'Affiliate' },
                      { id: 'createdAt', label: 'Created' },
                      { id: 'updatedAt', label: 'Last Update' }
                    ].map(column => (
                      <th 
                        key={column.id}
                        className="py-4 px-4 font-semibold text-gray-300 cursor-pointer"
                        onClick={() => handleSort(column.id)}
                      >
                        <div className="flex items-center">
                          {column.label}
                          {sortConfig.key === column.id && (
                            <span className="ml-1">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <motion.tr 
                      key={user.id}
                      className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="py-4 px-4 text-sm">{user.id}</td>
                      <td className="py-4 px-4 font-medium">{user.name}</td>
                      <td className="py-4 px-4">
                        <a 
                          href={`mailto:${user.email}`} 
                          className="text-[#3c9aab] hover:underline"
                        >
                          {user.email}
                        </a>
                      </td>
                      <td className="py-4 px-4">
                        {user.contact || <span className="text-gray-500">Not provided</span>}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isAdmin 
                            ? 'bg-[#3c9aab] text-white' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {user.isAdmin ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {user.affiliateUseCount > 0 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-400">
                            Used {user.affiliateUseCount} times
                          </span>
                        ) : (
                          <span className="text-gray-500">None</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-gray-500 text-sm">
          <p>• Click on column headers to sort data</p>
          <p>• Admin users have full access to the admin dashboard</p>
          <p>• Affiliate count shows how many times a customer's referral code has been used</p>
        </div>
      </div>
    </motion.div>
  );
}