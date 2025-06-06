const Review   = require('../models/Review');
const Product  = require('../models/Product');
const User     = require('../models/User');
const sendEmail= require('../utils/email');

// @desc    Create a review for a product.
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  // 1) ensure product exists
  const product = await Product.findByPk(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  // 2) create the review
  const review = await Review.create({
    userId:    req.user.id,
    productId,
    rating,
    comment
  });

  // 3) send thanks + affiliate-eligibility email
  const user = await User.findByPk(req.user.id);
  await sendEmail({
   to: user.email,
subject: 'Thank you for your review!',
html: `
<div style="background-color: #0f172a; padding: 32px; font-family: 'Inter', Arial, sans-serif; color: #e2e8f0; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; margin-bottom: 24px;">
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f40a5 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; border: 2px solid #7dd3fc;">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h1 style="color: #7dd3fc; font-size: 24px; margin: 0; font-weight: 600;">Thank You for Your Review!</h1>
  </div>

  <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; line-height: 1.6;">
    <p style="font-size: 16px; margin: 0 0 16px 0;">Hi <span style="color: #7dd3fc; font-weight: 500;">${user.name}</span>,</p>

    <p style="font-size: 16px; margin: 0 0 16px 0;">
      Thank you for taking the time to review <strong style="color: #7dd3fc;">${product.name}</strong>! We truly appreciate your feedback.
    </p>

    <p style="font-size: 16px; margin: 0 0 16px 0;">
      As a token of our appreciation, you're now eligible to 
      <a href="${process.env.CLIENT_URL}/affiliate/request" style="color: #7dd3fc; text-decoration: none; font-weight: 600;">request an affiliate link</a>.
    </p>

    <p style="font-size: 16px; margin: 0 0 16px 0;">Here's what you get:</p>
    <ul style="margin: 0 0 16px 20px; padding: 0; color: #e2e8f0; font-size: 16px;">
      <li style="margin-bottom: 8px;">5% discount on every product purchased through your link</li>
      <li>If more than 5 customers purchase through your link, we'll contact you to offer commission on future referrals</li>
    </ul>

    <p style="font-size: 16px; margin: 0 0 16px 0;">We’re excited to have you as part of the BASE 97 community!</p>
    <p style="font-size: 16px; margin: 0;">– The BASE 97 Team</p>
  </div>

  <div style="text-align: center; color: #94a3b8; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px;">
    <p style="margin: 0;">© ${new Date().getFullYear()} BASE 97. All rights reserved.</p>
  </div>
</div>
`

  }).catch(err => console.error('Review thank-you email error:', err));

  res.status(201).json(review);
};
exports.getReviewsByProduct = async (req, res) => {
    const { productId } = req.params;
    const reviews = await Review.findAll({ where: { productId } });
    res.json(reviews);
  };

  exports.deleteReview = async (req, res) => {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    await review.destroy();
    res.json({ message: 'Deleted' });
  };