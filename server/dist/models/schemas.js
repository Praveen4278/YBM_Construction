"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModel = exports.SettingsSchema = exports.UserModel = exports.UserSchema = exports.SubmissionModel = exports.SubmissionSchema = exports.ServiceModel = exports.ServiceSchema = exports.TestimonialModel = exports.TestimonialSchema = exports.ProjectModel = exports.ProjectSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Project Schema
exports.ProjectSchema = new mongoose_1.default.Schema({
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
exports.ProjectModel = mongoose_1.default.models.Project || mongoose_1.default.model('Project', exports.ProjectSchema);
// Testimonial Schema
exports.TestimonialSchema = new mongoose_1.default.Schema({
    author: { type: String, required: true },
    project: String,
    text: { type: String, required: true },
    avatar: String,
    rating: { type: Number, default: 5 }
});
exports.TestimonialModel = mongoose_1.default.models.Testimonial || mongoose_1.default.model('Testimonial', exports.TestimonialSchema);
// Service Schema
exports.ServiceSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: String,
    icon: String,
    image: String
});
exports.ServiceModel = mongoose_1.default.models.Service || mongoose_1.default.model('Service', exports.ServiceSchema);
// Submission Schema (Contact, Quote, & Visit requests)
exports.SubmissionSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: String,
    message: String,
    type: { type: String, enum: ['contact', 'quote', 'visit'], default: 'contact' },
    details: mongoose_1.default.Schema.Types.Mixed, // flexible container for project details/specs
    status: { type: String, enum: ['unread', 'in-progress', 'replied'], default: 'unread' },
    date: { type: Date, default: Date.now }
});
exports.SubmissionModel = mongoose_1.default.models.Submission || mongoose_1.default.model('Submission', exports.SubmissionSchema);
// Admin User Schema
exports.UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
});
exports.UserModel = mongoose_1.default.models.User || mongoose_1.default.model('User', exports.UserSchema);
// Settings Schema
exports.SettingsSchema = new mongoose_1.default.Schema({
    seoTitle: String,
    seoDescription: String,
    seoKeywords: String,
    phone: String,
    email: String,
    address: String
});
exports.SettingsModel = mongoose_1.default.models.Settings || mongoose_1.default.model('Settings', exports.SettingsSchema);
