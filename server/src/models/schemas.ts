import mongoose from 'mongoose';

// Project Schema
export const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  client: String,
  location: String,
  year: Number,
  area: String,
  type: { type: String, enum: ['residential', 'commercial'], default: 'residential' },
  category: { type: String, default: 'residential' },
  status: { type: String, enum: ['completed', 'ongoing', 'draft'], default: 'completed' },
  tag: String,
  description: String,
  image: String,
  gallery: [String],
  videos: [String],
  brochure: String,
  brochureUrl: String,
  timeline: [
    {
      title: String,
      status: { type: String, default: 'pending' },
      description: String,
      date: String
    }
  ],
  testimonials: [
    {
      author: String,
      text: String,
      rating: { type: Number, default: 5 },
      project: String
    }
  ],
  specs: {
    structure: String,
    flooring: String,
    kitchen: String,
    doors: String
  },
  modelConfig: {
    type: { type: String, default: 'villa' },
    color: { type: String, default: '#d4a853' },
    wireframe: { type: Boolean, default: false }
  },
  seo: {
    title: String,
    description: String,
    keywords: String
  },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

// Testimonial Schema
export const TestimonialSchema = new mongoose.Schema({
  author: { type: String, required: true },
  project: String,
  text: { type: String, required: true },
  avatar: String,
  rating: { type: Number, default: 5 }
});

export const TestimonialModel = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

// Service Schema
export const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  icon: String,
  image: String
});

export const ServiceModel = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

// Submission Schema (Contact, Quote, & Visit requests)
export const SubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: String,
  type: { type: String, enum: ['contact', 'quote', 'visit'], default: 'contact' },
  details: mongoose.Schema.Types.Mixed, // flexible container for project details/specs
  status: { type: String, enum: ['unread', 'in-progress', 'replied'], default: 'unread' },
  date: { type: Date, default: Date.now }
});

export const SubmissionModel = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);

// Admin User Schema
export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

// Settings Schema
export const SettingsSchema = new mongoose.Schema({
  seoTitle: String,
  seoDescription: String,
  seoKeywords: String,
  phone: String,
  email: String,
  address: String
});

export const SettingsModel = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
