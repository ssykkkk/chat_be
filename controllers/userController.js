const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email вже використовується' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const accessToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: newUser._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 днів
        });

        res.status(201).json({ message: 'Реєстрація успішна', accessToken });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при реєстрації', error });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Користувача не знайдено' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неправильний пароль' });
        }

        const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Використовувати secure тільки в production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 днів
        });

        res.status(200).json({ message: 'Логін успішний', accessToken });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при вході', error });
    }
};

module.exports = {
    register,
    login
};