"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dataService_1 = require("../config/dataService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Setup transporter conditionally
const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (host && user && pass) {
        return nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass }
        });
    }
    return null;
};
// @route   POST /api/submissions
// @desc    Submit a contact or quote request form
router.post('/', async (req, res) => {
    const { name, email, phone, subject, message, type, details } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required fields' });
    }
    try {
        // 1. Save to Database (MongoDB or fallback local file)
        const newSubmission = await dataService_1.dataService.createSubmission({
            name,
            email,
            phone,
            subject: subject || (type === 'quote' ? 'New Quote Request' : 'Website Contact Form'),
            message,
            type: type || 'contact',
            details: details || {}
        });
        // 2. Try to Send Notification Email
        const transporter = getTransporter();
        if (transporter) {
            const emailTo = process.env.SMTP_TO || 'hello@ybmconstruction.com';
            const mailOptions = {
                from: `"YBM Construction Website" <${process.env.SMTP_USER}>`,
                to: emailTo,
                subject: `New Lead: ${type === 'quote' ? 'Quote Request' : 'Contact Request'} from ${name}`,
                html: `
          <h2>New Website Inquiry</h2>
          <p><strong>Type:</strong> ${type === 'quote' ? 'Request a Quote' : 'General Inquiry'}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <p><strong>Message:</strong> ${message || 'No message text'}</p>
          ${type === 'quote' && details
                    ? `<h3>Project Details</h3>
                 <ul>
                   <li><strong>Project Type:</strong> ${details.projectType || 'N/A'}</li>
                   <li><strong>Approximate Budget:</strong> ${details.budget || 'N/A'}</li>
                   <li><strong>Area Size:</strong> ${details.areaSize || 'N/A'}</li>
                   <li><strong>Preferred Timeline:</strong> ${details.timeline || 'N/A'}</li>
                 </ul>`
                    : ''}
          <br>
          <p>This inquiry has been logged in the YBM Admin Dashboard.</p>
        `
            };
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('📧 Email delivery failed:', err.message);
                }
                else {
                    console.log('📧 Email sent successfully:', info.messageId);
                }
            });
        }
        else {
            console.log('ℹ️ SMTP is not configured. Email notification skipped (submission logged to DB).');
        }
        res.status(201).json({
            message: 'Inquiry submitted successfully',
            submission: newSubmission
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error processing inquiry' });
    }
});
// @route   GET /api/submissions
// @desc    Get all submissions (Admin only)
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const subs = await dataService_1.dataService.getSubmissions();
        res.json(subs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving inquiries' });
    }
});
// @route   PUT /api/submissions/:id/status
// @desc    Update submission status (Admin only)
router.put('/:id/status', auth_1.protect, async (req, res) => {
    const { status } = req.body;
    if (!status || !['unread', 'in-progress', 'replied'].includes(status)) {
        return res.status(400).json({ message: 'Please provide a valid status: unread, in-progress, replied' });
    }
    try {
        const updated = await dataService_1.dataService.updateSubmissionStatus(req.params.id, status);
        if (!updated) {
            return res.status(404).json({ message: 'Inquiry submission not found' });
        }
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating status' });
    }
});
exports.default = router;
