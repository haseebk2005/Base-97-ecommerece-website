// server/controllers/orderController.js

const Order            = require('../models/Order');
const OrderItem        = require('../models/OrderItem');
const Product          = require('../models/Product');
const AffiliateRequest = require('../models/AffiliateRequest');
const User             = require('../models/User');
const sendEmail        = require('../utils/email');
const ADMIN_EMAIL      = process.env.ADMIN_EMAIL;

// @desc    Create new order (with optional affiliate code)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    affiliateCode
  } = req.body;

  // 1) Lookup any approved affiliate request by code
  let affiliateOwnerId = null;
  let discountAmount   = 0;
  if (affiliateCode) {
    const aff = await AffiliateRequest.findOne({
      where: { affiliateCode, status: 'Approved' }
    });
    if (aff) {
      affiliateOwnerId = aff.userId;
      discountAmount   = parseFloat((0.05 * totalPrice).toFixed(2));
    }
  }

  // 2) Compute final total after discount
  const finalTotal = parseFloat((totalPrice - discountAmount).toFixed(2));

  // 3) Create the order, recording affiliate usage
  const order = await Order.create({
    userId:            req.user.id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice:        finalTotal,
    affiliateCodeUsed: affiliateCode || null,
    affiliateOwnerId
  });

  // 4) Bulk-create order items, including the selected size
  const items = orderItems.map(i => ({
    orderId:   order.id,
    productId: i.product,
    qty:       i.qty,
    price:     i.price,
    size:      i.size
  }));
  await OrderItem.bulkCreate(items);

  // 5) Prepare HTML for items list
  const itemsHtml = items.map(i =>
    `<li>Product ID ${i.productId} — Size: ${i.size} — Qty: ${i.qty} — PKR ${i.price.toFixed(2)}</li>`
  ).join('');

  // 6) Send confirmation email to customer
  const customer = await User.findByPk(req.user.id);
  const discountHtml = discountAmount > 0
    ? `<p>You saved PKR ${discountAmount.toFixed(2)} (5%) with affiliate code <strong>${affiliateCode}</strong>.</p>`
    : '';
  await sendEmail({
    to: customer.email,
subject: `Your BASE 97 Order #${order.id}`,
html: `
<div style="background-color: #0f172a; padding: 32px; font-family: 'Inter', Arial, sans-serif; color: #e2e8f0; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; margin-bottom: 24px;">
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f40a5 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; border: 2px solid #7dd3fc;">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h1 style="color: #7dd3fc; font-size: 24px; margin: 0 0 8px 0; font-weight: 600;">BASE 97 Order Confirmation</h1>
    <p style="color: #94a3b8; margin: 0; font-size: 16px;">Order #${order.id}</p>
  </div>

  <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; line-height: 1.6;">
    <p style="margin: 0 0 16px 0; font-size: 16px;">Hi <span style="color: #7dd3fc; font-weight: 500;">${customer.name}</span>,</p>

    <p style="margin: 0 0 16px 0; font-size: 16px;">
      Thank you for choosing BASE 97! We're excited to let you know that we've received your order <strong style="color: #7dd3fc;">#${order.id}</strong>. Below are the details:
    </p>

    <ul style="margin: 16px 0; padding-left: 20px; color: #e2e8f0;">
      ${itemsHtml}
    </ul>

    <p style="margin: 0 0 8px 0; font-size: 16px;">
      <span style="color: #7dd3fc; font-weight: 500;">Subtotal:</span> PKR ${itemsPrice.toFixed(2)}
    </p>
    <p style="margin: 0 0 8px 0; font-size: 16px;">
      <span style="color: #7dd3fc; font-weight: 500;">Shipping:</span> PKR ${shippingPrice.toFixed(2)}
    </p>
    ${discountHtml}
    <p style="margin: 0 0 24px 0; font-size: 16px;">
      <span style="color: #7dd3fc; font-weight: 500;">Total Paid:</span> PKR ${finalTotal.toFixed(2)}
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://yourdomain.com/track/${order.id}" style="background-color: #7dd3fc; color: #0f172a; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 15px;">
        Track Your Order
      </a>
    </div>

    <p style="margin: 0 0 8px 0; font-size: 16px;">
      <span style="color: #7dd3fc; font-weight: 500;">Shipping to:</span><br/>
      ${shippingAddress.address}, ${shippingAddress.city},<br/>
      ${shippingAddress.postalCode}, ${shippingAddress.country}
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px;">
      <span style="color: #7dd3fc; font-weight: 500;">Payment Method:</span> ${paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}
    </p>

    <p style="margin: 0 0 16px 0; font-size: 16px;">
      Leave a review to get affiliated and enjoy discounts 
      <a href="https://yourdomain.com/support" style="color: #7dd3fc; text-decoration: none;" target="_blank">Review</a>.
    </p>

    <p style="margin: 0 0 16px 0; font-size: 16px;">
      We’ll send you another update once your package ships. If you have any questions or need assistance, don’t hesitate to 
      <a href="https://yourdomain.com/support" style="color: #7dd3fc; text-decoration: none;" target="_blank">contact our support team</a>. We’re here to help!
    </p>

    <p style="margin: 0 0 0 0; font-size: 16px;">
      Thank you for being a valued member of the BASE 97 family. We look forward to serving you again soon.
    </p>
    <p style="margin: 16px 0 0 0; font-size: 16px;">– The BASE 97 Team</p>
  </div>

  <div style="text-align: center; color: #94a3b8; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px;">
    <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} BASE 97. All rights reserved.</p>
    <p style="margin: 0;">456 Innovation Blvd, Suite 100, Tech City, USA</p>
  </div>
</div>
`

  }).catch(err => console.error('Customer email error:', err));

  // 7) Notify admin (include affiliate owner’s name & ID if used)
  let affiliateInfo = '';
  if (affiliateOwnerId) {
    const owner = await User.findByPk(affiliateOwnerId);
    affiliateInfo = `
      <p>Affiliate code <strong>${affiliateCode}</strong> used by this order.</p>
      <p>Link owner: ${owner.name} (ID ${owner.id}).</p>
    `;
  }
  await sendEmail({
   to: ADMIN_EMAIL,
subject: `New Order #${order.id} Placed`,
html: `
<div style="background-color: #0f172a; padding: 32px; font-family: 'Inter', Arial, sans-serif; color: #e2e8f0; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="color: #7dd3fc; font-size: 22px; margin: 0; font-weight: 600;">
      New Order Placed – #${order.id}
    </h2>
  </div>

  <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; line-height: 1.6;">
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #7dd3fc; font-weight: 500;">
      Order Details:
    </p>
    <ul style="margin: 0 0 16px 20px; padding: 0; color: #e2e8f0; font-size: 16px;">
      ${itemsHtml}
    </ul>

    <p style="margin: 0 0 8px 0; font-size: 16px;">
      <strong>Total:</strong> PKR ${finalTotal.toFixed(2)}
    </p>
    <p style="margin: 0 0 8px 0; font-size: 16px;">
      <strong>Customer:</strong> ${customer.name} (
      <a href="mailto:${customer.email}" style="color: #7dd3fc; text-decoration: none;">
        ${customer.email}
      </a>
      )
    </p>

    ${affiliateInfo}
  </div>

  <div style="text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px;">
    This is an automated alert from BASE 97 Admin System.
  </div>
</div>
`

  }).catch(err => console.error('Admin email error:', err));

  // 8) Respond
  res.status(201).json(order);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [
      {
        model: OrderItem,
        as: 'OrderItems',
        include: [
          {
            model: Product,
            as: 'Product'
          }
        ]
      },
      {
        model: User,
        as: 'User',
        attributes: ['id', 'name', 'email']
      }
    ]
  });

  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

// @desc    Mark order as paid (if applicable)
// @route   POST /api/orders/:id/pay
// @access  Private
exports.payOrder = async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isPaid = true;
  order.paidAt = new Date();
  await order.save();
  res.json(order);
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: OrderItem,
        as: 'OrderItems',
        include: [
          {
            model: Product,
            as: 'Product'
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.json(orders);
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
exports.getOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      {
        model: User,
        as: 'User',
        attributes: ['id', 'name', 'email']
      },
      {
        model: OrderItem,
        as: 'OrderItems',
        include: [
          {
            model: Product,
            as: 'Product'
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.json(orders);
};

// @desc    Mark order as delivered
// @route   PUT /api/orders/:id/deliver
// @access  Admin
exports.updateOrderToDelivered = async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isDelivered = true;
  order.deliveredAt = new Date();
  await order.save();
  res.json(order);
};
