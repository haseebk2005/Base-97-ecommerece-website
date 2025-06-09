import { motion } from 'framer-motion';
import { FaTwitter, FaInstagram, FaFacebookF, FaYoutube, FaPinterest, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/white_logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.footer
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-16 px-4 sm:px-6 mt-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <div className="flex items-center mb-5">
              {/* Logo */}
              <motion.div 
                className="mb-4 md:mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link to="/">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 rounded-full shadow-lg mx-auto lg:mx-0 transition-all duration-300 hover:scale-105"
                  />
                </Link>
              </motion.div>
              <h2 className="ml-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">
                BASE 97
              </h2>
            </div>
            <p className="mb-6 max-w-md">
              Premium fitness apparel engineered for performance. Elevate your workout with gear that moves with you.
            </p>
            
            <div className="flex space-x-4">
              {[
                { icon: <FaTwitter className="w-5 h-5" />, label: 'Twitter' },
                { icon: <FaInstagram className="w-5 h-5" />, label: 'Instagram' },
                { icon: <FaFacebookF className="w-5 h-5" />, label: 'Facebook' },
                { icon: <FaYoutube className="w-5 h-5" />, label: 'YouTube' },
                { icon: <FaTiktok className="w-5 h-5" />, label: 'TikTok' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  aria-label={social.label}
                  className="bg-gray-800 p-3 rounded-full hover:bg-cyan-600 transition-colors duration-300"
                  whileHover={{ 
                    y: -5,
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-5 pb-2 border-b border-gray-700">Company</h3>
            <ul className="space-y-3">
              {['Home','Shopping', 'About Us', 'Blog', 'Affiliate Link'].map((item, index) => {
                let href = '/';
                if (item === 'Home') {
                  href = '/';
                } else if (item === 'Blog') {
                  href = '/blog';
                } else if (item === 'Affiliate Link') {
                  href = '/affiliate/request';
                }
                 else if (item === 'Shopping') {
                  href = '/Shopping';
                }

                return (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <a
                      href={href}
                      className="hover:text-cyan-400 transition-colors duration-200 flex items-center"
                    >
                      <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
                      {item}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-5 pb-2 border-b border-gray-700">Customer Service</h3>
            <ul className="space-y-3">
              {['Contact', 'Track Order', 'Email Us', 'Call Us'].map((item, index) => {
                let href = '/';
                if (item === 'Contact') {
                  href = '/';
                } else if (item === 'Track Order') {
                  href = '/track';
                } else if (item === 'Email Us') {
                  href = 'mailto:khanmuhammadabdulhaseeb@gmail.com';
                } else if (item === 'Call Us') {
                  href = 'tel:+923212156373';
                }

                return (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <a
                      href={href}
                      className="hover:text-cyan-400 transition-colors duration-200 flex items-center"
                    >
                      <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
                      {item}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="mb-4 md:mb-0">
              © {currentYear} Base 97. All rights reserved.
            </div>
            
            
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
