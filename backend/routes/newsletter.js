const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { authenticateToken, requireSuperAdmin } = require('./auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const uploadFiles = multer({ storage: storage });

// Public routes
router.get('/', async (req, res) => {
  try {
    const newsletters = await Newsletter.find({ status: 'published' })
      .sort({ publication_date: -1 })
      .populate('created_by', 'name');
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id)
      .populate('created_by', 'name');
    
    if (!newsletter || newsletter.status !== 'published') {
      return res.status(404).json({ message: 'Newsletter not found' });
    }

    res.json(newsletter);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/download', async (req, res) => {
  try {
    await Newsletter.findByIdAndUpdate(req.params.id, {
      $inc: { download_count: 1 }
    });
    res.json({ message: 'Download count updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes
router.get('/admin/all', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const newsletters = await Newsletter.find()
      .sort({ createdAt: -1 })
      .populate('created_by', 'name');
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/admin', authenticateToken, requireSuperAdmin, uploadFiles.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, publication_date, volume, issue, issue_number, status, tags } = req.body;
    
    console.log('Creating newsletter with data:', { title, description, publication_date, volume, issue, status });
    
    if (!title || !description || !publication_date || !volume || !issue) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newsletterData = {
      title: title.trim(),
      description: description.trim(),
      publication_date: new Date(publication_date),
      volume: parseInt(volume),
      issue: parseInt(issue),
      issue_number: issue_number ? issue_number.trim() : `Vol ${volume}, Issue ${issue}`,
      status: status || 'draft',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      created_by: req.user._id || req.user.id
    };

    // Store PDF as base64
    if (req.files && req.files.pdf) {
      try {
        console.log('Processing PDF file...');
        const pdfFile = req.files.pdf[0];
        
        newsletterData.pdf_data = pdfFile.buffer.toString('base64');
        newsletterData.pdf_filename = pdfFile.originalname;
        newsletterData.pdf_size = pdfFile.size;
        
        console.log('PDF processed successfully, size:', pdfFile.size);
      } catch (error) {
        console.error('PDF processing failed:', error);
        return res.status(500).json({ error: 'Failed to process PDF: ' + error.message });
      }
    } else {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    // Upload cover image if provided
    if (req.files && req.files.cover_image) {
      try {
        const imageResult = await uploadToCloudinary(req.files.cover_image[0].buffer, 'newsletters');
        newsletterData.cover_image = imageResult.secure_url;
      } catch (error) {
        console.error('Cover image upload failed:', error);
      }
    }

    const newsletter = new Newsletter(newsletterData);
    await newsletter.save();
    
    const populatedNewsletter = await Newsletter.findById(newsletter._id).populate('created_by', 'name');
    res.status(201).json(populatedNewsletter);
  } catch (error) {
    console.error('Error creating newsletter:', error);
    res.status(500).json({ message: 'Error creating newsletter', error: error.message });
  }
});

router.put('/admin/:id', authenticateToken, requireSuperAdmin, uploadFiles.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, publication_date, volume, issue, issue_number, status, tags } = req.body;
    
    const updateData = {
      title: title.trim(),
      description: description.trim(),
      publication_date: new Date(publication_date),
      volume: parseInt(volume),
      issue: parseInt(issue),
      issue_number: issue_number ? issue_number.trim() : `Vol ${volume}, Issue ${issue}`,
      status,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    };

    // Update PDF if provided
    if (req.files && req.files.pdf) {
      try {
        console.log('Processing new PDF file...');
        const pdfFile = req.files.pdf[0];
        
        updateData.pdf_data = pdfFile.buffer.toString('base64');
        updateData.pdf_filename = pdfFile.originalname;
        updateData.pdf_size = pdfFile.size;
        
        console.log('PDF processed successfully, size:', pdfFile.size);
      } catch (error) {
        console.error('PDF processing failed:', error);
        return res.status(500).json({ error: 'Failed to process PDF: ' + error.message });
      }
    }

    // Upload new cover image if provided
    if (req.files && req.files.cover_image) {
      try {
        const imageResult = await uploadToCloudinary(req.files.cover_image[0].buffer, 'newsletters');
        updateData.cover_image = imageResult.secure_url;
      } catch (error) {
        console.error('Cover image upload failed:', error);
      }
    }

    const newsletter = await Newsletter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('created_by', 'name');

    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }

    res.json(newsletter);
  } catch (error) {
    console.error('Error updating newsletter:', error);
    res.status(500).json({ message: 'Error updating newsletter', error: error.message });
  }
});

router.delete('/admin/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }
    res.json({ message: 'Newsletter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Serve PDF files
// Get newsletters by volume
router.get('/volume/:volume', async (req, res) => {
  try {
    const volume = parseInt(req.params.volume);
    const newsletters = await Newsletter.find({ 
      volume: volume, 
      status: 'published' 
    })
      .sort({ issue: 1 })
      .populate('created_by', 'name');
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available volumes
router.get('/volumes/list', async (req, res) => {
  try {
    const volumes = await Newsletter.aggregate([
      { $match: { status: 'published' } },
      { $group: { 
        _id: '$volume', 
        issueCount: { $sum: 1 },
        latestIssue: { $max: '$issue' }
      }},
      { $sort: { _id: -1 } }
    ]);
    res.json(volumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/pdf/:id', async (req, res) => {
  try {
    console.log('Serving PDF for newsletter ID:', req.params.id);
    
    const newsletter = await Newsletter.findById(req.params.id);
    console.log('Newsletter found:', !!newsletter);
    
    if (!newsletter) {
      console.log('Newsletter not found');
      return res.status(404).json({ message: 'Newsletter not found' });
    }
    
    console.log('Newsletter has pdf_data:', !!newsletter.pdf_data);
    console.log('Newsletter has pdf_url:', !!newsletter.pdf_url);
    
    // Handle new format (base64 data)
    if (newsletter.pdf_data) {
      console.log('Serving PDF from base64 data');
      const pdfBuffer = Buffer.from(newsletter.pdf_data, 'base64');
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${newsletter.pdf_filename || 'newsletter.pdf'}"`,
        'Content-Length': pdfBuffer.length,
        'Cache-Control': 'public, max-age=31536000'
      });
      
      return res.send(pdfBuffer);
    }
    
    // Handle old format (external URL) - redirect
    if (newsletter.pdf_url) {
      console.log('Redirecting to external PDF URL:', newsletter.pdf_url);
      return res.redirect(newsletter.pdf_url);
    }
    
    console.log('No PDF data found in newsletter');
    return res.status(404).json({ message: 'PDF not found' });
    
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;