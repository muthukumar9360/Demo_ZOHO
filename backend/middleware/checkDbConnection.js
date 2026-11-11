const mongoose = require('mongoose');

/**
 * Middleware that checks if database is connected before executing DB operations.
 * Returns immediate 503 instead of waiting for query timeout if DB is offline.
 */
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        'MongoDB Atlas is not connected. Please verify your connection string in backend/.env and make sure your IP is whitelisted in Atlas.',
      dbStatus: 'disconnected',
    });
  }
  next();
};

module.exports = checkDbConnection;
