// client/src/pages/AffiliateRequest.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

export default function AffiliateRequest() {
  const { token } = useContext(AuthContext);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const submitRequest = async () => {
    setMsg(''); 
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/affiliate`, {}, config);
      setMsg(`Request submitted! Status: ${data.status}`);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#3c9aab]/50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#3c9aab] p-6 text-white">
          <h2 className="text-3xl font-bold">Become an Affiliate</h2>
          <p className="mt-2 opacity-90">Earn commissions by sharing our products</p>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex items-start mb-6">
            <div className="bg-[#e8f6f9] text-[#3c9aab] rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 flex-1">
              To qualify for an affiliate link, you must first submit at least one product review. 
              Once approved, you'll receive a unique tracking link to share with your audience.
            </p>
          </div>

          <button
            onClick={submitRequest}
            disabled={loading}
            className={`
              w-full py-4 rounded-xl text-lg font-medium transition-all
              ${loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-[#3c9aab] hover:bg-[#2a7b8a] active:scale-[98%] text-white shadow-md hover:shadow-lg'}
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Request...
              </div>
            ) : (
              'Submit Affiliate Request'
            )}
          </button>

          {msg && (
            <div className={`mt-6 p-4 rounded-lg border ${
              msg.includes('submitted') 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="font-medium flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {msg}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4 text-center text-gray-500 text-sm border-t">
          <p>Earn up to 5% commission on every referral sale</p>
        </div>
      </div>
    </div>
  );
}