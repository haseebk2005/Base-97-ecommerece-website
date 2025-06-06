import { Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Redirect effect animation state
  const redirectVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    document.body.classList.add('bg-gray-900');
    return () => {
      document.body.classList.remove('bg-gray-900');
    };
  }, []);

  if (user && user.isAdmin) {
    return (
      <motion.div
        variants={redirectVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex flex-col bg-gray-900 text-gray-100"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={redirectVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center bg-gray-900"
    >
      <Navigate to="/login" replace />
    </motion.div>
  );
}
