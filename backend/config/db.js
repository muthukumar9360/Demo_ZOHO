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
 * Connects to MongoDB Atlas
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'cloud_task_manager';

  if (!uri || uri.includes('PASTE_MY_MONGODB_ATLAS_CONNECTION_STRING_HERE')) {
    console.warn(
      '\n⚠️  [MongoDB Warning]: MONGODB_URI is not set or still contains the placeholder in backend/.env.\n' +
      '👉 Please open backend/.env and replace PASTE_MY_MONGODB_ATLAS_CONNECTION_STRING_HERE with your MongoDB Atlas connection string.\n'
    );
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: dbName,
    });

    console.log(`✅ [MongoDB Connected]: Host -> ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.error('❌ [MongoDB Connection Error]: Could not connect to database.');
    console.error(`   Message: ${error.message}`);
    console.error('   Please verify your network access (IP Whitelist in Atlas) and credentials in backend/.env.\n');
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
    host: mongoose.connection.host ? mongoose.connection.host : null
  };
};

module.exports = { connectDB, getConnectionStatus };
