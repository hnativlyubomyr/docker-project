const mongoose = require('mongoose');

const schemaPost = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        minLength: [5, 'Must be at least 5'],
        maxLength: [15, 'Must be no more than 15'],
    },
    body: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    }
}, { versionKey:false })

const Post = mongoose.model("Post", schemaPost);

module.exports = Post;
