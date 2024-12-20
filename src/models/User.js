const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firebaseId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    matters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Matter",
        },
    ],
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
