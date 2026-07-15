import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { dataService } from '../config/dataService';
import { protect } from '../middleware/auth';

const router = Router();

// Setup transporter conditionally
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
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
router.post('/', async (req: Request, res: Response) => {
  const { name, email, phone, subject, message, type, details } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required fields' });
  }

  try {
    // 1. Save to Database (MongoDB or fallback local file)
    const newSubmission = await dataService.createSubmission({
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
      const emailTo = process.env.SMTP_TO || 'hello@ybmconstruction.in';
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
          ${
            type === 'quote' && details
              ? `<h3>Project Details</h3>
                 <ul>
                   <li><strong>Project Type:</strong> ${details.projectType || 'N/A'}</li>
                   <li><strong>Approximate Budget:</strong> ${details.budget || 'N/A'}</li>
                   <li><strong>Area Size:</strong> ${details.areaSize || 'N/A'}</li>
                   <li><strong>Preferred Timeline:</strong> ${details.timeline || 'N/A'}</li>
                 </ul>`
              : ''
          }
          <br>
          <p>This inquiry has been logged in the YBM Admin Dashboard.</p>
        `
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('📧 Email delivery failed:', err.message);
        } else {
          console.log('📧 Email sent successfully:', info.messageId);
        }
      });
    } else {
      console.log('ℹ️ SMTP is not configured. Email notification skipped (submission logged to DB).');
    }

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      submission: newSubmission
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error processing inquiry' });
  }
});

// @route   GET /api/submissions
// @desc    Get all submissions (Admin only)
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    const subs = await dataService.getSubmissions();
    res.json(subs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving inquiries' });
  }
});

// @route   PUT /api/submissions/:id/status
// @desc    Update submission status (Admin only)
router.put('/:id/status', protect, async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['unread', 'in-progress', 'replied'].includes(status)) {
    return res.status(400).json({ message: 'Please provide a valid status: unread, in-progress, replied' });
  }

  try {
    const updated = await dataService.updateSubmissionStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Inquiry submission not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

export default router;
