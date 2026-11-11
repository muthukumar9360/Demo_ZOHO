const mongoose = require('mongoose');

/**
 * Safely masks credentials in MongoDB connection URI for logging
 * @param {string} uri 
 * @returns {string} masked uri
 */
const maskURI = (uri) => {
  if (!uri) return 'undefined';
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
};

/**
 * Checks if the URI is a template placeholder
 */
const isPlaceholderURI = (uri) => {
  if (!uri) return true;
  return (
    uri.includes('PASTE_MY_MONGODB_ATLAS_CONNECTION_STRING_HERE') ||
    uri.includes('<username>') ||
    uri.includes('<password>') ||
    uri.includes('<your-cluster>')
  );
};

/**
 * Connects to MongoDB Atlas
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'cloud_task_manager';

  if (isPlaceholderURI(uri)) {
    console.warn(
      '\n⚠️  [MongoDB Notice]: MONGODB_URI contains placeholder text in backend/.env.\n' +
      '👉 Please open backend/.env and replace <username>, <password>, and <your-cluster> with your real MongoDB Atlas connection string.\n'
    );
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: dbName,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging indefinitely
    });

    console.log(`✅ [MongoDB Connected]: Host -> ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.error('❌ [MongoDB Connection Error]: Could not connect to MongoDB Atlas.');
    console.error(`   Message: ${error.message}`);
    console.error('   Please check your IP Whitelist (Network Access in Atlas) and database credentials in backend/.env.\n');
    return false;
  }
};

/**
 * Returns current database connection state
 */
const getConnectionStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    state: states[stateCode] || 'unknown',
    isConnected: stateCode === 1,
    dbName: mongoose.connection.name || process.env.DB_NAME || 'cloud_task_manager',
    host: mongoose.connection.host ? mongoose.connection.host : null,
  };
};

module.exports = { connectDB, getConnectionStatus, isPlaceholderURI };
