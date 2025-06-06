import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Add a dark background class while this route is mounted
  useEffect(() => {
    document.body.classList.add('bg-gray-900');
    return () => {
      document.body.classList.remove('bg-gray-900');
    };
  }, []);

  // Animation settings for page transitions
  const transitionVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  // If user is authenticated, render the protected content
  if (user) {
    return (
      <motion.div
        variants={transitionVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex flex-col bg-gray-900 text-gray-100"
      >
        {children}
      </motion.div>
    );
  }

  // Not authenticated: send them to register, remembering where they came from
  return (
    <motion.div
      variants={transitionVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center bg-gray-900"
    >
      <Navigate
        to="/register"
        replace
        state={{ from: location }}
      />
    </motion.div>
  );
}
