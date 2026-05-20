require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');

// Connect to Database
connectDB();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION! 💥 Shutting down...`);
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
