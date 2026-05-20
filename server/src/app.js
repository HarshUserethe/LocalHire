const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const { AppError } = require('./utils/responseHandler');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', process.env.CLIENT_URL],
  credentials: true
}));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Serve static files (temporary until S3 migration)
app.use('/resume', express.static(path.join(__dirname, '../resume')));
app.use('/profile', express.static(path.join(__dirname, '../profile')));

// Routes
app.get('/home', (req, res) => {
    res.status(200).json({ message: "Welcome To Server" });
});

// Import and mount modular routes here later
const authRoutes = require('./routes/authRoutes');
app.use('/api/v1/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/v1/users', userRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/v1/dashboard', dashboardRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
