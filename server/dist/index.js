"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
// Route Imports
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const testimonials_1 = __importDefault(require("./routes/testimonials"));
const services_1 = __importDefault(require("./routes/services"));
const submissions_1 = __importDefault(require("./routes/submissions"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const settings_1 = __importDefault(require("./routes/settings"));
const upload_1 = __importDefault(require("./routes/upload"));
// Load config variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Enable CORS — allow localhost in dev and Vercel domain in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:5173', 'http://127.0.0.1:5173',
        'http://localhost:5174', 'http://127.0.0.1:5174',
        'http://localhost:5175', 'http://127.0.0.1:5175',
        'http://localhost:5176', 'http://127.0.0.1:5176'
    ];
app.use((0, cors_1.default)({ origin: allowedOrigins, credentials: true }));
// Body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static public assets from root directory (brochures, logos, photos)
const rootDir = path_1.default.resolve(process.cwd(), '..');
app.use('/static-assets', express_1.default.static(rootDir));
// Bind Routes
app.use('/api/auth', auth_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/testimonials', testimonials_1.default);
app.use('/api/services', services_1.default);
app.use('/api/submissions', submissions_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/settings', settings_1.default);
app.use('/api/upload', upload_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'YBM Construction backend is operational' });
});
// Export app for Vercel serverless
exports.default = app;
// Start Server & Connect Database (only when run directly, not in serverless)
if (process.env.VERCEL !== '1') {
    const startServer = async () => {
        await (0, db_1.connectDB)();
        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    };
    startServer();
}
