const e = require('express');
const { prisma } = require('../config/db');

const addToWatchList = async (req, res) => {
const {  movieId,status,rating } = req.body;
const userId = req.user.id;

//verify movie exists
const movie = await prisma.movie.findUnique({
    where: {
        id: movieId,
    },
});

if (!movie) {
    return res.status(404).json({ message: 'Movie not found' });
}

// check if movie already exists in watchlist

const existInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
        userId_movieId: {
            userId: userId,
            movieId: movieId,
        },
    },
});

if (existInWatchlist) {
    return res.status(400).json({ message: 'Movie already exists in watchlist' });
}

// add movie to watchlist
const watchListItem = await prisma.watchlistItem.create({
    data: {
        userId,
        movieId,
        status,
        rating,
    },
});

res.status(201).json({ status: true, data: watchListItem, message: 'Movie added to watchlist successfully' });


}

const updateToWatchList = async (req, res) => {
    const {  status, rating } = req.body;
    const { movieId } = req.params;
    const userId = req.user.id;

    //verify movie exists
    const movie = await prisma.movie.findUnique({
        where: {
            id: movieId,
        },
    });

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    // check if movie already exists in watchlist

    const existInWatchlist = await prisma.watchlistItem.findUnique({
        where: {
            userId_movieId: {
                userId: userId,
                movieId: movieId,
            },
        },
    });

    if (!existInWatchlist) {
        return res.status(400).json({ message: 'Movie does not exist in watchlist' });
    }

    // update movie in watchlist
    const watchListItem = await prisma.watchlistItem.update({
        where: {
            userId_movieId: {
                userId: userId,
                movieId: movieId,
            },
        },
        data: {
            status,
            rating,
        },
    });

    res.status(200).json({ status: true, data: watchListItem, message: 'Movie updated in watchlist successfully' });
};

module.exports = { addToWatchList, updateToWatchList };