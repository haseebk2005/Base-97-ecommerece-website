const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createReview,
  getReviewsByProduct,  // <-- make sure this exists!,
  deleteReview
} = require('../controllers/reviewController');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/:productId', getReviewsByProduct); // <- this is crashing if getReviewsByProduct is undefined
router.delete('/:id',protect, admin, deleteReview);

module.exports = router;
