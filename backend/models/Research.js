// models/Research.js
const mongoose = require('mongoose');

const researchAreaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Brain' },
  color: { type: String, default: 'from-blue-500 to-purple-600' },
  projects_count: { type: Number, default: 0 },
  publications_count: { type: Number, default: 0 }
}, { timestamps: true });

const researchProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  research_area: { type: String, required: true },
  institution: { type: String, required: true },
  status: { type: String, enum: ['ongoing', 'completed'], required: true },
  funding: String,
  duration: String,
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const researchPublicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: String, required: true },
  journal: { type: String, required: true },
  year: { type: Number, required: true },
  type: { type: String, enum: ['journal', 'conference'], required: true },
  citations: { type: Number, default: 0 },
  doi: String,
  url: String,
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const researchStatsSchema = new mongoose.Schema({
  total_projects: { type: Number, default: 0 },
  total_publications: { type: Number, default: 0 },
  total_collaborations: { type: Number, default: 0 },
  total_awards: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = {
  ResearchArea: mongoose.model('ResearchArea', researchAreaSchema),
  ResearchProject: mongoose.model('ResearchProject', researchProjectSchema),
  ResearchPublication: mongoose.model('ResearchPublication', researchPublicationSchema),
  ResearchStats: mongoose.model('ResearchStats', researchStatsSchema)
};