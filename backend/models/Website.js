// models/Website.js
const mongoose = require('mongoose');

// Members Schema
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  position: String,
  department: String,
  institution: String,
  bio: String,
  image_url: String,
  linkedin_url: String,
  google_scholar_url: String,
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// Executive Committee Schema
const executiveCommitteeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  email: String,
  institution: String,
  image_url: String,
  bio: String,
  order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// News Schema
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: String,
  image_url: String,
  author: String,
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  tags: [String],
  slug: String
}, { timestamps: true });

// Gallery Schema
const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image_url: { type: String, required: true },
  event_name: String,
  event_date: Date,
  photographer: String,
  tags: [String],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

// Contact Messages Schema
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: String,
  message: { type: String, required: true },
  phone: String,
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  replied_at: Date,
  reply_message: String
}, { timestamps: true });

// Achievements Schema
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['award', 'publication', 'project', 'event'], required: true },
  date: { type: Date, required: true },
  recipient: String,
  organization: String,
  image_url: String,
  url: String,
  featured: { type: Boolean, default: false }
}, { timestamps: true });

// Site Stats Schema
const siteStatsSchema = new mongoose.Schema({
  total_members: { type: Number, default: 0 },
  total_events: { type: Number, default: 0 },
  total_publications: { type: Number, default: 0 },
  total_projects: { type: Number, default: 0 },
  page_views: { type: Number, default: 0 },
  last_updated: { type: Date, default: Date.now }
}, { timestamps: true });

// Carousel Images Schema
const carouselImageSchema = new mongoose.Schema({
  title: String,
  description: String,
  image_url: { type: String, required: true },
  link_url: String,
  order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// Events Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  event_date: { type: Date, required: true },
  end_date: Date,
  location: String,
  venue: String,
  organizer: String,
  contact_email: String,
  contact_phone: String,
  registration_url: String,
  image_url: String,
  category: { type: String, enum: ['workshop', 'seminar', 'conference', 'meeting', 'other'], default: 'other' },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  is_featured: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  max_participants: Number,
  registration_deadline: Date,
  tags: [String]
}, { timestamps: true });

// User Roles Schema (for admin management)
const userRoleSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'super_admin', 'editor', 'member'], default: 'admin' },
  name: String,
  is_active: { type: Boolean, default: true },
  last_login: Date,
  permissions: [String]
}, { timestamps: true });

module.exports = {
  Member: mongoose.model('Member', memberSchema),
  ExecutiveCommittee: mongoose.model('ExecutiveCommittee', executiveCommitteeSchema),
  News: mongoose.model('News', newsSchema),
  Gallery: mongoose.model('Gallery', gallerySchema),
  ContactMessage: mongoose.model('ContactMessage', contactMessageSchema),
  Achievement: mongoose.model('Achievement', achievementSchema),
  SiteStats: mongoose.model('SiteStats', siteStatsSchema),
  CarouselImage: mongoose.model('CarouselImage', carouselImageSchema),
  UserRole: mongoose.model('UserRole', userRoleSchema),
  Event: mongoose.model('Event', eventSchema)
};