// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { apiLimiter, securityHeaders } = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(securityHeaders);

// Rate limiting
if (process.env.NODE_ENV === 'production') {
  app.use('/api/', apiLimiter);
}

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL, 'https://ieee-sps-gs-website.vercel.app', 'https://ieee-sps-gs-website-*.vercel.app']
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    if (allowedOrigins.includes(origin) || 
        origin.includes('ieee-sps-gs-website') && origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // For development, allow localhost
    if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
const { router: authRouter } = require('./routes/auth');
const { authLimiter } = require('./middleware/security');

// Apply auth rate limiting
if (process.env.NODE_ENV === 'production') {
  app.use('/api/auth', authLimiter);
}
app.use('/api/auth', authRouter);
app.use('/api/research', require('./routes/research'));
app.use('/api/events', require('./routes/events'));
app.use('/api/members', require('./routes/members'));
app.use('/api/content', require('./routes/content'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/awards', require('./routes/awards'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/public', require('./routes/public'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});