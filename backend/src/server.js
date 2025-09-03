const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/health`);
});

// Handle port already in use error
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please try one of the following:`);
    console.log(`1. Kill the process using port ${PORT}:`);
    console.log(`   - Windows: netstat -ano | findstr :${PORT}`);
    console.log(`   - Then: taskkill /PID <PID> /F`);
    console.log(`2. Or set a different port in your .env file:`);
    console.log(`   PORT=5001`);
    console.log(`3. Or use a different port temporarily:`);
    console.log(`   npm run dev -- --port 5001`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
