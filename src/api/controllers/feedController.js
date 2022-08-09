// Internal Imports
const User = require('../models/User');
const Post = require('../models/Post');

// Get feed
module.exports.getFeed = async (req, res) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 3;

    const user = await User.findById(req.userId);
    const total = await Post.find({
      userId: { $in: user.following },
    }).countDocuments();

    let posts = await Post.find({ userId: { $in: user.following } })
      .populate('userId', ['name'])
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      posts: posts,
      total: total,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};