const router = require('express').Router();
const { createOrder, getOrderById, payOrder,
        getMyOrders, getOrders, updateOrderToDelivered } =
      require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/pay')
  .put(protect, payOrder);

router.route('/:id/deliver')
  .put(protect, admin, updateOrderToDelivered);

module.exports = router;
