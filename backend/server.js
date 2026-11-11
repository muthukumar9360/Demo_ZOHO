const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const healthRoutes = require('./routes/healthRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables from backend/.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend development server
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Cloud Task Manager API',
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
