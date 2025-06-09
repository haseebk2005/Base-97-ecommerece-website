import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext.jsx';
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminAffiliateRequests() {
  const { token } = useContext(AuthContext);
  const [reqs, setReqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios.get(`${API_URL}/api/affiliate`, config)
      .then(res => {
        setReqs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const act = async (id, verb) => {
    setReqs(prev => prev.map(r => r.id === id ? {...r, status: 'Processing...'} : r));
    await axios.put(`${API_URL}/api/affiliate/${id}/${verb}`, {}, config);
    setReqs(prev => prev.map(r => r.id === id ? {...r, status: verb === 'approve' ? 'Approved' : 'Rejected'} : r));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#3c9aab] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Loading affiliate requests...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-900 mt-20 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3c9aab]">Affiliate Requests</h1>
          <p className="text-gray-400 mt-2">
            Manage affiliate applications from users
          </p>
        </div>

        {reqs.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4 text-gray-600">📭</div>
            <h3 className="text-xl text-gray-300">No pending requests</h3>
            <p className="text-gray-500 mt-2">
              All affiliate applications have been processed
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#3c9aab] bg-opacity-20 text-left">
                    {['ID', 'User', 'Email', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="py-4 px-4 font-semibold text-gray-300">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reqs.map((r) => (
                    <motion.tr 
                      key={r.id}
                      className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="py-4 px-4 text-sm">{r.id}</td>
                      <td className="py-4 px-4 font-medium">{r.User.name}</td>
                      <td className="py-4 px-4 text-gray-400">{r.User.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          r.status === 'Approved' 
                            ? 'bg-green-900/50 text-green-400' 
                            : r.status === 'Rejected' 
                              ? 'bg-red-900/50 text-red-400'
                              : r.status === 'Processing...'
                                ? 'bg-yellow-900/50 text-yellow-400'
                                : 'bg-gray-700 text-gray-300'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          {r.status === 'Pending' && (
                            <>
                              <motion.button
                                onClick={() => act(r.id, 'approve')}
                                className="bg-[#3c9aab] hover:bg-[#2a7a8b] text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Approve
                              </motion.button>
                              <motion.button
                                onClick={() => act(r.id, 'reject')}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Reject
                              </motion.button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-gray-500 text-sm">
          <p>• Approved affiliates will receive commission on referred sales</p>
          <p>• Rejected applications can be reconsidered if the user reapplies</p>
        </div>
      </div>
    </motion.div>
  );
}