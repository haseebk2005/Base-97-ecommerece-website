// // server/server.js

// require('dotenv').config();
// const express = require('express');
// const path = require('path');
// const multer = require('multer');
// const cors = require('cors');
// const { sequelize } = require('./config/db');
// const seedAdmin = require('./seedAdmin');
// const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// // Import route modules
// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const userRoutes = require('./routes/userRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const affiliateRoutes = require('./routes/affiliateRoutes');

// const app = express();

// // ── MIDDLEWARE ──
// app.use(cors({ origin: process.env.CLIENT_URL }));
// app.use(express.json());

// // ── MULTER SETUP FOR LOCAL “uploads/” FOLDER (DEV ONLY) ──
// // 1) Ensure you have created a folder called “uploads” at the root of your server:
// //      mkdir uploads
// //      chmod 755 uploads
// //
// // 2) Configure Multer to write all incoming “image” files into ./uploads
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     // __dirname points to server/; uploads/ must live alongside server.js
//     cb(null, path.join(__dirname, 'uploads'));
//   },
//   filename(req, file, cb) {
//     // e.g. “1623456789012_originalName.png”
//     const uniqueName = Date.now() + '_' + file.originalname;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // 3) Expose “/uploads” as a static folder
// //    Now GET  /uploads/abc.png will serve ./uploads/abc.png
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // 4) Add a single‐file upload route at /api/upload
// //    Frontend should POST a FormData containing { image: <File> }
// app.post('/api/upload', upload.single('image'), (req, res) => {
//   // If multer succeeded, req.file.filename is the saved filename
//   // We return a JSON object with { url: "/uploads/<filename>" }
//   res.json({ url: `/uploads/${req.file.filename}` });
// });

// // ── MOUNT EXISTING ROUTES ──
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/affiliate', affiliateRoutes);
// app.use('/api/reviews', require('./routes/reviewRoutes'));

// // 404 handler
// app.use(notFound);

// // Global error handler
// app.use(errorHandler);

// // ── START SERVER ──
// const PORT = process.env.PORT || 5000;
// (async () => {
//   try {
//     // Sync models (alter to match schema without dropping data)
//     await sequelize.sync({ alter: true });
//     console.log('✅ Database & models synchronized');

//     // Seed admin user if missing
//     await seedAdmin();
//     console.log('✅ Admin user seeded (if not existing)');

//     // Start listening
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`📂 Serving uploads from: ${path.join(__dirname, 'uploads')}`);
//     });
//   } catch (err) {
//     console.error('🔥 Failed to initialize server:', err);
//     process.exit(1);
//   }
// })();
// server/server.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const { sequelize, connectDB } = require('./config/db');
const seedAdmin = require('./seedAdmin');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const affiliateRoutes = require('./routes/affiliateRoutes');

const app = express();

// ── MIDDLEWARE ──
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// ── MULTER SETUP FOR LOCAL “uploads/” FOLDER (DEV ONLY) ──
// Ensure uploads/ exists at project root
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename(req, file, cb) {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Expose uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ── MOUNT ROUTES ──
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Error handlers
app.use(notFound);
app.use(errorHandler);

// ── START SERVER ──
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // 1) Ensure DB exists and connect
    await connectDB();

    // 2) Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Database & models synchronized');

    // 3) Seed admin user
    await seedAdmin();
    console.log('✅ Admin user seeded');

    // 4) Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📂 Serving uploads from: ${path.join(__dirname, 'uploads')}`);
    });
  } catch (err) {
    console.error('🔥 Failed to initialize server:', err);
    process.exit(1);
  }
})();


