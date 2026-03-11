const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    try {

        // check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

};

const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {

        // find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        // generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                rating: user.rating
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

};

const getProfile = async (req, res) => {

    res.json({
        user: req.user
    });

};

module.exports = { registerUser, loginUser, getProfile };