// server/controllers/affiliateController.js
const AffiliateRequest = require('../models/AffiliateRequest');
const Review           = require('../models/Review');           // ← add this
const User             = require('../models/User');
const sendEmail        = require('../utils/email');
const crypto           = require('crypto');
const ADMIN_EMAIL      = process.env.ADMIN_EMAIL;

// @desc    Customer submits affiliate link request
// @route   POST /api/affiliate
// @access  Private
exports.createRequest = async (req, res) => {
  // Prevent duplicate pending requests
  // 0) Must have at least one review
  const hasReview = await Review.findOne({ where: { userId: req.user.id } });
  if (!hasReview) {
    return res
      .status(400)
      .json({ message: 'You must submit at least one product review before requesting an affiliate link.' });
  }
  const existing = await AffiliateRequest.findOne({
    where: { userId: req.user.id, status: 'Pending' }
  });
  if (existing) {
    return res.status(400).json({ message: 'You already have a pending request' });
  }

  const reqRec = await AffiliateRequest.create({
    userId: req.user.id,
    status: 'Pending'
  });
  res.status(201).json(reqRec);
};

// @desc    List all affiliate requests (for admin review)
// @route   GET /api/affiliate
// @access  Admin
exports.listRequests = async (req, res) => {
  const all = await AffiliateRequest.findAll({
    include: [{
      model: User,
      attributes: ['id', 'name', 'email']
    }],
    order: [['createdAt', 'DESC']]
  });
  res.json(all);
};

// @desc    Approve a pending affiliate request, generate code, email customer & notify admin
// @route   PUT /api/affiliate/:id/approve
// @access  Admin
exports.approveRequest = async (req, res) => {
  const { id } = req.params;
  const reqRec = await AffiliateRequest.findByPk(id);
  if (!reqRec) {
    return res.status(404).json({ message: 'Request not found' });
  }
  if (reqRec.status !== 'Pending') {
    return res.status(400).json({ message: 'Request is not pending' });
  }

  // Generate a 9-character alphanumeric code
  const code = crypto.randomBytes(6).toString('base64')
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 9)
    .toUpperCase();

  reqRec.status         = 'Approved';
  reqRec.affiliateCode  = code;
  await reqRec.save();

  const user = await User.findByPk(reqRec.userId);

  // Email the customer
  await sendEmail({
    to: user.email,
subject: '✨ Your Exclusive BASE 97 Affiliate Program Access',
html: `
<div style="background-color: #0f172a; padding: 32px; font-family: 'Inter', Arial, sans-serif; color: #e2e8f0; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; margin-bottom: 24px;">
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f40a5 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; border: 2px solid #7dd3fc;">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h1 style="color: #7dd3fc; font-size: 24px; margin-bottom: 8px; margin-top: 0; font-weight: 600;">Welcome to Our Affiliate Program</h1>
    <p style="color: #94a3b8; margin: 0; font-size: 16px;">Start earning with your unique link below</p>
  </div>

  <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; margin-bottom: 24px; line-height: 1.6;">
    <p style="margin-top: 0; font-size: 16px;">Dear ${user.name},</p>
    <p style="font-size: 16px;">We're thrilled to have you join the BASE 97 Affiliate Program. Here's everything you need to get started:</p>
    
    <div style="background-color: #0f172a; padding: 16px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; font-weight: 500; color: #7dd3fc;">Your Affiliate Details:</p>
      <p style="margin: 8px 0;"><strong>Affiliate Code:</strong> <span style="background-color: #1e40af; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${code}</span></p>
      <p style="margin: 8px 0;"><strong>User ID:</strong> ${user.id}</p>
    </div>

    <div style="margin: 24px 0;">
      <p style="font-weight: 500; margin-bottom: 12px;">Your exclusive referral link:</p>
      <div style="background-color: #0f172a; padding: 12px; border-radius: 4px; border: 1px dashed #7dd3fc; word-break: break-all; font-family: monospace; font-size: 14px;">
        ${process.env.CLIENT_URL}/checkout?aff=${code}
      </div>
      <p style="font-size: 14px; color: #94a3b8; margin-top: 8px;">*Recipients get 5% off their first purchase</p>
    </div>

    <div style="background-color: #0f172a; border-left: 3px solid #7dd3fc; padding: 16px; margin: 20px 0; border-radius: 0 4px 4px 0;">
      <p style="margin: 0; font-style: italic; color: #94a3b8; font-size: 15px;">"Great partnerships begin with shared success. We're committed to your growth as our affiliate."</p>
    </div>

    <div style="text-align: center; margin: 28px 0 16px;">
      <a href="${process.env.CLIENT_URL}/affiliate-dashboard" style="background-color: #7dd3fc; color: #0f172a; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 15px;">Access Your Affiliate Dashboard</a>
    </div>
  </div>

  <div style="text-align: center; color: #94a3b8; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 16px;">
    <p style="margin: 0 0 8px 0;">Need help or have questions?</p>
    <p style="margin: 0;">
      <a href="mailto:affiliates@base97.com" style="color: #7dd3fc; text-decoration: none; font-weight: 500;">Contact our affiliate team</a>
    </p>
    <div style="margin-top: 24px;">
      <p style="margin: 0; font-size: 13px;">© ${new Date().getFullYear()} BASE 97 Affiliate Program</p>
    </div>
  </div>
</div>
`
  }).catch(err => console.error('Affiliate approval email error:', err));

  // Notify admin of approval
  await sendEmail({
    to: ADMIN_EMAIL,
subject: `✅ Affiliate Approved | ${user.name} | Code: ${code}`,
html: `
<div style="background-color: #0f172a; padding: 24px; font-family: 'Inter', Arial, sans-serif; color: #e2e8f0; max-width: 700px; margin: 0 auto; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  <div style="display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #1e293b;">
    <div style="background-color: #14532d; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#86efac" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div>
      <h1 style="color: #86efac; font-size: 20px; margin: 0 0 4px 0;">Affiliate Request Approved</h1>
      <p style="color: #94a3b8; margin: 0; font-size: 14px;">Request #${reqRec.id}</p>
    </div>
  </div>

  <div style="background-color: #1e293b; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
      <div style="background-color: #0f172a; padding: 16px; border-radius: 4px;">
        <h3 style="color: #7dd3fc; font-size: 15px; margin-top: 0; margin-bottom: 12px;">USER DETAILS</h3>
        <p style="margin: 8px 0;"><strong>Name:</strong> ${user.name}</p>
        <p style="margin: 8px 0;"><strong>ID:</strong> ${user.id}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${user.email}" style="color: #7dd3fc; text-decoration: none;">${user.email}</a></p>
      </div>
      
      <div style="background-color: #0f172a; padding: 16px; border-radius: 4px;">
        <h3 style="color: #7dd3fc; font-size: 15px; margin-top: 0; margin-bottom: 12px;">AFFILIATE CODE</h3>
        <div style="background-color: #1e293b; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 15px; word-break: break-all; text-align: center; border: 1px dashed #7dd3fc;">
          ${code}
        </div>
      </div>
    </div>

    <div style="background-color: #0f172a; border-left: 3px solid #7dd3fc; padding: 12px 16px; margin: 16px 0; border-radius: 0 4px 4px 0;">
      <p style="margin: 0; font-size: 14px; color: #94a3b8;">
        <strong style="color: #7dd3fc;">Approval Note:</strong> This affiliate can now access their dashboard and start generating referrals.
      </p>
    </div>
  </div>

  <div style="text-align: center; color: #94a3b8; font-size: 13px; padding-top: 16px; border-top: 1px solid #1e293b;">
    <p style="margin: 0 0 8px 0;">Approved at: ${new Date().toLocaleString()}</p>
    <p style="margin: 0;">
      <a href="${process.env.ADMIN_DASHBOARD_URL}/affiliates/${user.id}" style="color: #7dd3fc; text-decoration: none; font-weight: 500;">View in Admin Dashboard</a>
    </p>
    <div style="margin-top: 16px;">
      <p style="margin: 0;">BASE 97 Affiliate Management System</p>
    </div>
  </div>
</div>
`
  }).catch(err => console.error('Admin affiliate notification error:', err));

  res.json(reqRec);
};

// @desc    Reject a pending affiliate request
// @route   PUT /api/affiliate/:id/reject
// @access  Admin
exports.rejectRequest = async (req, res) => {
  const { id } = req.params;
  const reqRec = await AffiliateRequest.findByPk(id);
  if (!reqRec) {
    return res.status(404).json({ message: 'Request not found' });
  }
  if (reqRec.status !== 'Pending') {
    return res.status(400).json({ message: 'Request is not pending' });
  }

  reqRec.status = 'Rejected';
  await reqRec.save();

  const user = await User.findByPk(reqRec.userId);

  // Optionally email the customer about rejection
  await sendEmail({
    to: user.email,
subject: 'Affiliate Request Update',
html: `
<div style="background-color: #0f172a; padding: 32px; font-family: 'Inter', Arial, sans-serif; color: #e2e8f0; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; margin-bottom: 24px;">
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f40a5 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; border: 2px solid #7dd3fc;">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm0 2c4.411 0 8 3.589 8 8 0 4.412-3.589 8-8 8s-8-3.588-8-8c0-4.411 3.589-8 8-8zm1 3h-2v6h6v-2h-4V7z" fill="#7dd3fc"/>
      </svg>
    </div>
    <h1 style="color: #7dd3fc; font-size: 24px; margin: 0 0 8px 0; font-weight: 600;">Affiliate Request Update</h1>
  </div>

  <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; line-height: 1.6;">
    <p style="margin: 0 0 16px 0; font-size: 16px;">Hi ${user.name},</p>

    <p style="margin: 0 0 16px 0; font-size: 16px;">
      We regret to inform you that your affiliate request <strong style="color: #7dd3fc;">#${reqRec.id}</strong> was not approved.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px;">
      We understand this might be disappointing. If you believe this decision was made in error or if you'd like guidance on how to strengthen a future application, please reach out to our support team. We’re here to help and want to see you succeed.
    </p>

    <div style="text-align: center; margin-top: 16px;">
      <a href="https://yourdomain.com/support" style="background-color: #7dd3fc; color: #0f172a; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 15px;">Contact Support</a>
    </div>
  </div>

  <div style="text-align: center; color: #94a3b8; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px;">
    <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
    <p style="margin: 0;">1234 Cloud Avenue, Suite 500, Tech City, USA</p>
  </div>
</div>
`

  }).catch(err => console.error('Affiliate rejection email error:', err));

  res.json(reqRec);
};
