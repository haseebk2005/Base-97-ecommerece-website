// server/controllers/adminController.js

const { Op, fn, col } = require('sequelize');
const { sequelize }    = require('../config/db');
const Order            = require('../models/Order');
const OrderItem        = require('../models/OrderItem');
const User             = require('../models/User');
const sendEmail        = require('../utils/email');
const Review  = require('../models/Review');
const Product = require('../models/Product');
const VALID_STATUSES = ['Pending','Paid','Dispatched','Delivered','Cancelled'];
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL;

// @desc    Get all customers with affiliate‐link usage counts
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    // 1) Fetch basic user info
    const users = await User.findAll({
      attributes: ['id','name','email','isAdmin','createdAt','updatedAt']
    });

    // 2) Fetch counts of orders that used each affiliate owner's code
    const uses = await Order.findAll({
      attributes: [
        'affiliateOwnerId',
        [fn('COUNT', col('id')), 'useCount']
      ],
      where: { affiliateOwnerId: { [Op.ne]: null } },
      group: ['affiliateOwnerId']
    });

    // 3) Build a map: ownerId → useCount
    const usageMap = uses.reduce((acc, row) => {
      acc[row.get('affiliateOwnerId')] = parseInt(row.get('useCount'), 10);
      return acc;
    }, {});

    // 4) Merge into user list
    const result = users.map(u => ({
      ...u.get(),
      affiliateUseCount: usageMap[u.id] || 0
    }));

    res.json(result);
  } catch (err) {
    console.error('❌ getAllUsers error:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Get dashboard metrics for orders
// @route   GET /api/admin/metrics
// @access  Admin
exports.getDashboardMetrics = async (req, res) => {
  try {
    // Counts by status
    const total      = await Order.count();
    const pending    = await Order.count({ where: { status: 'Pending' } });
    const paid       = await Order.count({ where: { status: 'Paid' } });
    const dispatched = await Order.count({ where: { status: 'Dispatched' } });
    const delivered  = await Order.count({ where: { status: 'Delivered' } });
    const cancelled  = await Order.count({ where: { status: 'Cancelled' } });

    // Sales over last 30 days (USD)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sales = await Order.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('SUM', col('totalPrice')), 'salesUSD']
      ],
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
      group: ['date'],
      order: [['date', 'ASC']]
    });

    // Top 10 products by quantity sold
    const [topProducts] = await sequelize.query(`
      SELECT oi.productId, SUM(oi.qty) AS totalQty
      FROM OrderItems oi
      GROUP BY oi.productId
      ORDER BY totalQty DESC
      LIMIT 10;
    `);

    res.json({
      total,
      pending,
      paid,
      dispatched,
      delivered,
      cancelled,
      sales: sales.map(r => ({
        date:     r.get('date'),
        salesUSD: parseFloat(r.get('salesUSD'))
      })),
      topProducts
    });
  } catch (err) {
    console.error('❌ getDashboardMetrics error:', err);
    res.status(500).json({ message: 'Server error fetching dashboard metrics' });
  }
};

// @desc    Update an order's status and send notifications
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    // Record timestamps
    if (status === 'Paid' && !order.isPaid) {
      order.isPaid  = true;
      order.paidAt  = new Date();
    }
    if (status === 'Delivered' && !order.isDelivered) {
      order.isDelivered  = true;
      order.deliveredAt  = new Date();
    }
    await order.save();

    // Send emails on status changes
    const user = await User.findByPk(order.userId);
    if (status === 'Paid') {
      await sendEmail({
        to: user.email,
subject: `Payment Confirmed | Order #${order.id}`,
html: `
<div style="background-color: #0f172a; padding: 32px; font-family: 'Inter', Arial, sans-serif; color: #e2e8f0; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; margin-bottom: 24px;">
    <div style="background-color: #1e293b; width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; border: 2px solid #7dd3fc;">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h1 style="color: #7dd3fc; font-size: 24px; margin-bottom: 8px; margin-top: 0; font-weight: 600;">Payment Received</h1>
    <p style="color: #94a3b8; margin: 0; font-size: 16px;">Order #${order.id}</p>
  </div>

  <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; margin-bottom: 24px; line-height: 1.6;">
    <p style="margin-top: 0; font-size: 16px;">Dear ${user.name},</p>
    <p style="font-size: 16px;">We've successfully processed your payment for <strong style="color: #7dd3fc;">order #${order.id}</strong>. Your order is now being prepared with care.</p>
    
    <div style="background-color: #0f172a; border-left: 3px solid #7dd3fc; padding: 16px; margin: 20px 0; border-radius: 0 4px 4px 0;">
      <p style="margin: 0; font-style: italic; color: #94a3b8; font-size: 15px;">"Your trust is our privilege. We're crafting your order with the utmost attention to detail."</p>
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://base97.com/orders/${order.id}" style="background-color: #7dd3fc; color: #0f172a; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 15px;">View Order Details</a>
    </div>
  </div>

  <div style="text-align: center; color: #94a3b8; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 16px;">
    <p style="margin: 0 0 8px 0;">Need assistance with your order?</p>
    <p style="margin: 0;">
      <a href="mailto:support@base97.com" style="color: #7dd3fc; text-decoration: none; font-weight: 500;">Contact our support team</a>
    </p>
    <div style="margin-top: 24px;">
      <p style="margin: 0;">© ${new Date().getFullYear()} BASE 97. All rights reserved.</p>
    </div>
  </div>
</div>
`
      }).catch(err => console.error('Thank-you email error:', err));
    } else if (status === 'Dispatched') {
      await sendEmail({
        to: user.email,
subject: `🚀 Your Order #${order.id} Is On The Way!`,
html: `
<div style="background-color: #0f172a; padding: 32px; font-family: 'Inter', Arial, sans-serif; color: #e2e8f0; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; margin-bottom: 24px;">
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; border: 2px solid #7dd3fc;">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3L6 6M16 16L21 21M21 3L6 18M16 6L21 11M11 3L3 11" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h1 style="color: #7dd3fc; font-size: 24px; margin-bottom: 8px; margin-top: 0; font-weight: 600;">Your Order Is On The Move</h1>
    <p style="color: #94a3b8; margin: 0; font-size: 16px; letter-spacing: 0.5px;">ORDER #${order.id}</p>
  </div>

  <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; margin-bottom: 24px; line-height: 1.6;">
    <p style="margin-top: 0; font-size: 16px;">Dear ${user.name},</p>
    <p style="font-size: 16px;">Great news! Your BASE 97 order <strong style="color: #7dd3fc;">#${order.id}</strong> has left our warehouse and is now on its journey to you.</p>
    
    <div style="background-color: #0f172a; border-left: 3px solid #7dd3fc; padding: 16px; margin: 20px 0; border-radius: 0 4px 4px 0;">
      <p style="margin: 0; font-style: italic; color: #94a3b8; font-size: 15px;">"Excellence is in transit. Your premium items are carefully packaged and on their way."</p>
    </div>

    <div style="margin: 24px 0; text-align: center;">
      <a href="https://base97.com/track/${order.id}" style="background-color: transparent; color: #7dd3fc; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 15px; border: 2px solid #7dd3fc;">Track Your Package</a>
    </div>

    <p style="font-size: 15px; color: #94a3b8; text-align: center;">
      Expected delivery: 3-5 business days
    </p>
  </div>

  <div style="text-align: center; color: #94a3b8; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 16px;">
    <p style="margin: 0 0 8px 0;">Questions about your shipment?</p>
    <p style="margin: 0;">
      <a href="mailto:support@base97.com" style="color: #7dd3fc; text-decoration: none; font-weight: 500;">Contact our delivery team</a>
    </p>
    <div style="margin-top: 24px;">
      <p style="margin: 0; font-size: 13px;">© ${new Date().getFullYear()} BASE 97. All rights reserved.</p>
    </div>
  </div>
</div>
`
      }).catch(err => console.error('Dispatch email error:', err));
    }

    res.json(order);
  } catch (err) {
    console.error('❌ updateOrderStatus error:', err);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};
// @desc    Get all reviews (admin only)
// @route   GET /api/admin/reviews
// @access  Admin
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User,    attributes: ['id','name','email'] },
        { model: Product, attributes: ['id','name'] }
      ],
      order: [['createdAt','DESC']]
    });
    res.json(reviews);
  } catch (err) {
    console.error('getAllReviews error:', err);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};