const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
 
const { addToWatchList,updateToWatchList } = require('../controllers/watchListController');

router.use(authMiddleware); // Apply authMiddleware to all routes in this router

router.post('/addToWatchList', addToWatchList); 
router.put('/updateWatchListItem/:movieId', updateToWatchList);

module.exports = router;