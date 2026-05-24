const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Post content cannot be empty']
  },
  contentHash: {
    type: String,
    required: true,
    unique: true // Guarantees a deterministic proof-of-origin fingerprint
  },
  aiScore: {
    humanProbability: { type: Number, required: true },
    aiProbability: { type: Number, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);