const mongoose = require('mongoose');

const schemaUser = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        minLength: [3, 'Must be at least 3'],
        maxLength: [64, 'Must be no more than 64'],
    },
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: [6, 'Must be at least 6'],
        maxLength: [16, 'Must be no more than 16'],
    },
    password: {
        type: String,
        unique: true,
        required: true,
        minLength: [6, 'Must be at least 6'],
        maxLength: [16, 'Must be no more than 16'],
    },
}, { versionKey:false })

const User = mongoose.model("User", schemaUser);

module.exports = User;
