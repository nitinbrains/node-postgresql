const dotenv = require('dotenv');
dotenv.config();

const { connectDB,disconnectDB } = require('./config/db');
connectDB();

const express = require('express');
const app = express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//IMPORT ROUTES
movieRoutes = require('./routes/movieRoutes');
authRoutes = require('./routes/authRoutes');
watchListRoutes = require('./routes/watchListRoutes');




//USE ROUTES
app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);
app.use('/watchlist', watchListRoutes);















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

