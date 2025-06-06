import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import logo from '../assets/white_logo.png';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 120, damping: 8, delay: 0.2 }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeInOut', staggerChildren: 0.1 }
    }
  };

  return (
    <motion.nav
      className="absolute top-0 w-full z-20 backdrop-blur-sm bg-black/0 shadow-xl text-white px-6 py-0 flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
    >
      {/* Logo Section */}
      <motion.div
        className="flex items-center space-x-3"
        variants={logoVariants}
        initial="hidden"
        animate="visible"
      >
        <Link to="/" className="flex items-center">
          <motion.img
            src={logo}
            alt="Logo"
            className="h-22 w-22 rounded-lg"
            whileHover={{
              scale: 1.05,
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.6 }
            }}
            transition={{ type: 'spring', stiffness: 400 }}
          />
        </Link>
        <motion.span
          className="text-4xl font-extrabold text-white"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          BASE 97
        </motion.span>
      </motion.div>

      {/* Hamburger (Mobile) */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Desktop Nav */}
      <motion.div
        className="hidden md:flex items-center space-x-6"
        variants={linkVariants}
        initial="hidden"
        animate="visible"
      >
<Link to="/" className="hover:text-gray-200">Home</Link>
<Link to="/blog" className=" text-white">Blog</Link>
        

        {user && (
          <>
            <Link to="/review" className=" text-white">Leave a Review</Link>
            <Link to="/track" className="hover:text-gray-200">Track Order</Link>
          </>
        )}

        <Link to="/cart" className="relative py-1 px-3 hover:bg-gray-800 rounded-md transition-colors">
          Cart
          <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        </Link>

        {user ? (
          <>
          {/* <Link to={'/profile'}><span className='font-semibold'>{user.name}</span></Link> */}
            {user.isAdmin && <Link to="/admin" className="hover:text-gray-200">Admin Dashboard</Link>}
            
          </>
        ) : (
          <>
          </>
        )}
      </motion.div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-20 left-0 w-full bg-gray-800 text-white p-4 space-y-4 flex flex-col shadow-md z-20 "
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Link to="/" onClick={toggleMenu}>Home</Link>
            <Link to="/blog" onClick={toggleMenu}>Blog</Link>
            {user && (
              <>
                <Link to="/review" onClick={toggleMenu}>Leave a Review</Link>
                <Link to="/track" onClick={toggleMenu}>Track Order</Link>
              </>
            )}
            <Link to="/cart" onClick={toggleMenu}>Cart ({cartItems.length})</Link>

            {user ? (
              <>
                {/* <Link to={'/profile'}  onClick={toggleMenu}><span>{user.name}</span></Link> */}
                {user.isAdmin && <Link to="/admin" onClick={toggleMenu}>Admin Dashboard</Link>}
              </>
            ) : (
              <>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
