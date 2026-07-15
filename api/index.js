const app = require('../server/dist/index').default;
const { connectDB } = require('../server/dist/config/db');

// Connect DB on cold start
connectDB();

module.exports = app;
