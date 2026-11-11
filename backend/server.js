const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const healthRoutes = require('./routes/healthRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables from backend/.env
dotenv.config();

const app = express();
// Zoho Catalyst AppSail allocates dynamic listen port via X_ZOHO_CATALYST_LISTEN_PORT
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allows Catalyst Web Client and local development
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Welcome route for API
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Cloud Task Manager API (Zoho Catalyst Ready)',
    endpoints: {
      health: '/api/health',
      tasks: '/api/tasks',
      taskStats: '/api/tasks/stats/summary',
    },
  });
});

// Mount API Routes
app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

// If frontend build is packaged together, serve static client files
const clientDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Fallback root endpoint when backend runs standalone
  app.get('/', (req, res) => {
    res.status(200).json({
      service: 'Cloud Task Manager Backend API',
      status: 'online',
      platform: 'Zoho Catalyst AppSail',
      health: '/api/health',
      tasks: '/api/tasks',
    });
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server function
let server;
const startServer = async () => {
  // Connect to MongoDB Atlas
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`🚀 [Server Running]: http://localhost:${PORT}`);
    console.log(`📡 [Health Check]: http://localhost:${PORT}/api/health`);
    console.log(`📋 [Tasks Endpoint]: http://localhost:${PORT}/api/tasks`);
  });
};

// Auto-start server when executed directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
