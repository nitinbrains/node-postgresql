
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

//read the token from request // check if token valid

const authMiddleware = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        //verify token and extract user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = user; // attach user to request object
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
}

module.exports = authMiddleware;