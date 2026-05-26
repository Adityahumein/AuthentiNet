const express = require('express');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
const FormData = require('form-data');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const Post = require('./models/Post');
const dynamicShield = require('./middleware/dynamicShield'); // Long-term reputational shield import

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Connection
connectDB();

// Global JSON Text Stream Body Parser Configuration
app.use(express.json());

// Strict Enterprise CORS Configuration (Blocks Cross-Site Scraper Exploits)
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST']
}));

// Apply the Long-Term Dynamic Security Shield globally across all /api configurations
app.use('/api', dynamicShield);

// Pass 1 Shield: Short-Term Session Rate Limiter Ingestion Bridge
const standardIngestLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5-minute transient window tracking context
  max: 30, // Limit each IP to 30 media interactions per window frame
  handler: async (req, res) => {
    // Hand off the tracking session violation directly to our persistent MongoDB strike registry
    if (res.triggerSecurityStrike) {
      await res.triggerSecurityStrike();
    }
    res.status(429).json({
      success: false,
      error: "Rate limit boundary exceeded. Long-term reputational penalty window escalated."
    });
  }
});

// Configure Multer In-Memory Buffer Limits for high-capacity ingestion
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // Strict 50MB architecture ceiling guard
});

// Structural Router Registrations
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Complete Hybrid Ingestion & Analysis Pipeline Endpoint
app.post('/api/media/verify', standardIngestLimit, upload.single('mediaAsset'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No media asset detected." });
    }

    const fileName = req.file.originalname;
    const fileMimeType = req.file.mimetype;
    const fileBuffer = req.file.buffer;

    console.log(`[Media Gateway Ingest] Processing: ${fileName}`);

    // 1. Calculate deterministic SHA-256 digital fingerprint signature
    const fileContentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Duplicate Check Query
    const existingAsset = await Post.findOne({ contentHash: fileContentHash });
    if (existingAsset) {
      return res.status(400).json({ success: false, error: "Duplicate media footprint detected on block registry." });
    }

    let aiMetrics = { humanProbability: 0.5, aiProbability: 0.5 };
    let extractedTextSummary = `Binary file asset specification trace [${fileName}].`;

    // 2. Forward Buffers cleanly down to Local Python FastAPI Cluster (Port 8000)
    if (
      fileName.endsWith('.pdf') || 
      fileMimeType === 'application/pdf' ||
      fileMimeType.startsWith('image/') ||
      fileMimeType.startsWith('video/')
    ) {
      console.log(` -> Forwarding binary asset [${fileName}] directly to local Python ML cluster...`);
      
      const pythonFormData = new FormData();
      pythonFormData.append('file', fileBuffer, { filename: fileName, contentType: fileMimeType });
      
      const pythonResponse = await axios.post('http://localhost:8000/analyze-file', pythonFormData, {
        headers: { ...pythonFormData.getHeaders() }
      });
      
      aiMetrics = pythonResponse.data;
      extractedTextSummary = pythonResponse.data.extractedText || `Forensic tracking completed for ${fileName}.`;
    } 
    else {
      return res.status(400).json({ success: false, error: "Unsupported multi-media file format parameters." });
    }

    // 3. Convert image binary arrays to safe inline strings for fast frontend display rendering
    let inlineThumbnail = null;
    if (fileMimeType.startsWith('image/')) {
      inlineThumbnail = `data:${fileMimeType};base64,${fileBuffer.toString('base64')}`;
    }

    const fallbackUserId = req.user && req.user.id ? req.user.id : "65f1a2b3c4d5e6f7a8b9c0d1";

    // 4. Save entire transaction verified tracking state to MongoDB explorer posts collection
    const newMediaPost = new Post({
      userId: fallbackUserId, 
      content: extractedTextSummary,
      contentHash: fileContentHash,
      aiScore: {
        humanProbability: aiMetrics.humanProbability,
        aiProbability: aiMetrics.aiProbability
      },
      assetMeta: {
        isMedia: true,
        fileName: fileName,
        fileMimeType: fileMimeType,
        thumbnailRaw: inlineThumbnail
      }
    });

    await newMediaPost.save();
    console.log(`[Database Write Success] Saved to Global Explorer Ledger.`);

    return res.json({ success: true, meta: newMediaPost });

  } catch (error) {
    console.error("====== MEDIA ROUTE EXCEPTION TRACE ======");
    console.error("Details:", error.message);
    console.error("=========================================");
    
    // Catch-all route layer security guard: Penalize malicious structural data breaking attempts
    if (res.triggerSecurityStrike) {
      await res.triggerSecurityStrike();
    }
    
    res.status(500).json({ success: false, error: "Media registration pipeline breakdown." });
  }
});

// Standard System Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "active", message: "AuthentiNet Server is live" });
});

// Start Server Loop
app.listen(PORT, () => {
  console.log(`[Server Ready] Running seamlessly on port ${PORT}`);
});