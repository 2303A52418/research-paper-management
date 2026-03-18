const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    res.send("User Registered Successfully");
});

// LOGIN
router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.send("User not found");

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) return res.send("Wrong password");

    res.send("Login Successful");
});

module.exports = router;