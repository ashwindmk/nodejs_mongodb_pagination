const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    body: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Post', postSchema, 'post');
