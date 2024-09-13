// controllers/userController.js
const User = require('../model/usermodel');

// PUT /api/posts/:postId/like
exports.updateUserDetails = async (req, res) => {
    try {
      const reqId = req.params.id;
  
      // Find the post by ID
      const user = await User.findById(reqId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { username, email } = req.body; 
      console.log(user, "Called");
      user.name = username;
      user.email = email;
  
      // Save the updated post to the database
      await user.save();
  
      res.json({ message: 'User updated successfully', userDetails: {
        email: user.email,
        userName: user.name,
      } });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };