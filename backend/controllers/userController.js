const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    // req.user is set by the authMiddleware
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.searchUsers = async (req, res) => {
    const keyword = req.query.email
        ? {
              email: {
                  $regex: req.query.email,
                  $options: 'i', // Case-insensitive
              },
          }
        : {};

    // Find users, but exclude the person who is currently logged in
    const users = await User.find(keyword)
        .find({ _id: { $ne: req.user._id } })
        .limit(10) // Limit results to 10
        .select('name email'); // Only send back name and email

    res.json(users);
};