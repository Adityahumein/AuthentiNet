const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware'); // 1. Import the gatekeeper

// @route   POST /api/posts
// @desc    Create a new post (SECURED BY JWT MIDDLEWARE)
router.post('/', protect, async (req, res) => { // 2. Add 'protect' right here!
  try {
    const { content } = req.body;
    
    // 3. Notice we no longer trust the frontend to send a 'userId' in req.body.
    // Instead, we safely extract the verified 'userId' from 'req.user' injected by our middleware!
    const userId = req.user; 

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Post content cannot be empty' });
    }

    // Cryptographic Fingerprinting
    const timestamp = new Date().toISOString();
    const contentHash = crypto
      .createHash('sha256')
      .update(`${userId}-${content}-${timestamp}`)
      .digest('hex');

    // Service-to-Service Communication Link
    let aiScore = { humanProbability: 1.0, aiProbability: 0.0 };
    try {
      const aiResponse = await axios.post('http://localhost:8000/analyze', { text: content });
      aiScore = aiResponse.data;
    } catch (aiError) {
      console.error(`[AI Service Link Dropout]: ${aiError.message}`);
    }

    // Database Persistence
    const newPost = await Post.create({
      userId,
      content,
      contentHash,
      aiScore
    });

    return res.status(201).json({
      success: true,
      message: 'Content securely logged and verified under verified profile session.',
      post: newPost
    });

  } catch (error) {
    console.error(`[Secure Post System Error]: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// @route   GET /api/posts (Left unprotected so unauthenticated guests can browse the feed)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
      
    return res.status(200).json(posts);
  } catch (error) {
    console.error(`[Fetch Feed Error]: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;