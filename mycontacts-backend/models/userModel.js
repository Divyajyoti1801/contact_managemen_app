const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add username"],
    },
    email: {
        type: String,
        require: [true, "Please add the user email address"],
        unique: [true, "Email Address already Taken"]
    },
    password: {
        type: String,
        require: [true, "Please add a strong password"],
    }
}, {
    timestamp: true,
});

module.exports = mongoose.model("User", userSchema);