const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//@desc POST All Contacts
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All Fields are mandatory")
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User Already Registered");
    }

    //Creating hash password:
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username, email, password: hashedPassword
    });
    if (user) {
        res.status(201).json({_id:user.id,email:user.email});
    } else {
        res.status(400);
        throw new Error("User Data not valid");
    }
    console.log(user);
    res.json({ message: "Register the user" });
});

//@desc POST Login Contacts
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        req.status(400);
        throw new Error("All Fields are necessary");
    }
    const user = await User.findOne({ email });
    
    //Compare Password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            },
        }, process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
        res.status(200).json({accessToken});
    }else{
        res.status(401);
        throw new Error("Email or Password not valid");
    }
    res.json({ message: "Login the user" });
});

//@desc GET Current User
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler( async (req, res) => {
    res.json(req.user);
});

module.exports = { registerUser,loginUser,currentUser };
