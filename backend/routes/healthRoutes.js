const express = require('express');
const router = express.Router();
const { getConnectionStatus } = require('../config/db');

/**
 * @desc    Check system & database health
 * @route   GET /api/health
 * @access  Public
 */
router.get('/', (req, res) => {
  const dbStatus = getConnectionStatus();

  res.status(200).json({
    status: 'ok',
    service: 'Cloud Task Manager Backend API',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus.state,
      connected: dbStatus.isConnected,
      name: dbStatus.dbName,
    },
  });
});

module.exports = router;
