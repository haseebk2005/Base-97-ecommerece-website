const User = require('../models/User');
exports.getUserProfile = (req,res) => {
  res.json(req.user);
};
exports.updateUserProfile = async (req,res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = await bcrypt.hash(req.body.password,10);
    const updated = await user.save();
    res.json({
      _id:updated._id, name:updated.name, email:updated.email,
      isAdmin:updated.isAdmin, token: generateToken(updated._id)
    });
  } else {
    res.status(404).json({ message:'User not found' });
  }
};
