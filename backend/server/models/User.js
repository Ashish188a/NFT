const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    walletAddress: {
        type: String,
        unique: true,
        sparse: true,
        default: null
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);