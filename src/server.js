const dotenv = require('dotenv');
dotenv.config();

const { connectDB,disconnectDB } = require('./config/db');
connectDB();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//IMPORT ROUTES
movieRoutes = require('./routes/movieRoutes');




//USE ROUTES
app.use('/movies', movieRoutes);















//DB ERROR HANDLING
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    disconnectDB();
    console.log('Process terminated');
  });
});

