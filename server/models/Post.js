const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    default: "" // Optional if it's a pure image/video asset
  },
  contentHash: {
    type: String,
    required: true,
    unique: true
  },
  aiScore: {
    humanProbability: { type: Number, required: true },
    aiProbability: { type: Number, required: true }
  },
  // --- NEW MULTI-MEDIA SCHEMATIC FIELDS ---
  assetMeta: {
    isMedia: { type: Boolean, default: false },
    fileName: { type: String, default: null },
    fileMimeType: { type: String, default: null },
    thumbnailRaw: { type: String, default: null } // Base64 encoding to render visuals inline
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);