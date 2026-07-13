
const { prisma } = require('../config/db');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
    const body = req.body;
    const { name, email, password } = body;

    //check if user already exists
    const userExists = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    //hash password
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });
     
    //generate token
     const token = generateToken(user.id, res);

    res.status(201).json({ status: true, data: { user: { id: user.id, name: user.name, email: user.email }, token }, message: 'User registered successfully' });
}

const login = async (req, res) => {
    const { email, password } = req.body;

    //check if user exists
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    //check password
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    //generate token
    const token = generateToken(user.id, res);

    res.status(200).json({ status: true,
         data: { 
            user: { id: user.id, name: user.name, email: user.email },
            token
         },
         message: 'User logged in successfully' });
}

const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ status: true, message: 'User logged out successfully' });
}

module.exports = { register, login, logout };