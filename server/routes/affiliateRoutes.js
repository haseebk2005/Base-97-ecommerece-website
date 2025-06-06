const router = require('express').Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createRequest, listRequests,
  approveRequest, rejectRequest
} = require('../controllers/affiliateController');

router.post('/', protect, createRequest);
router.get('/',   protect, admin, listRequests);
router.put('/:id/approve',  protect, admin, approveRequest);
router.put('/:id/reject',   protect, admin, rejectRequest);

module.exports = router;
