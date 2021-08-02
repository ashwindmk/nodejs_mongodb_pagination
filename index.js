const express = require('express');
const app = express();

const mongoose = require('mongoose');
const User = require('./model/user');
const Post = require('./model/post');

mongoose.connect('mongodb://root:ashwin123@localhost:27017/paginationdb', { authSource: 'admin', useNewUrlParser: true, useUnifiedTopology: true });

// Populate dummy data
const db = mongoose.connection;
db.once('open', async () => {
    if (await User.countDocuments().exec() == 0) {
        Promise.all([
            User.create({id: 1, name: 'User 1'}),
            User.create({id: 2, name: 'User 2'}),
            User.create({id: 3, name: 'User 3'}),
            User.create({id: 4, name: 'User 4'}),
            User.create({id: 5, name: 'User 5'}),
    
            User.create({id: 6, name: 'User 6'}),
            User.create({id: 7, name: 'User 7'}),
            User.create({id: 8, name: 'User 8'}),
            User.create({id: 9, name: 'User 9'}),
            User.create({id: 10, name: 'User 10'}),
    
            User.create({id: 11, name: 'User 11'}),
            User.create({id: 12, name: 'User 12'}),
            User.create({id: 13, name: 'User 13'}),
            User.create({id: 14, name: 'User 14'}),
            User.create({id: 15, name: 'User 15'}),
        ])
        .then(() => console.log('Users added'));
    }

    if (await Post.countDocuments().exec() == 0) {
        Promise.all([
            Post.create({body: 'Post 1'}),
            Post.create({body: 'Post 2'}),
            Post.create({body: 'Post 3'}),
            Post.create({body: 'Post 4'}),
            Post.create({body: 'Post 5'}),
    
            Post.create({body: 'Post 6'}),
            Post.create({body: 'Post 7'}),
            Post.create({body: 'Post 8'}),
            Post.create({body: 'Post 9'}),
            Post.create({body: 'Post 10'}),
    
            Post.create({body: 'Post 11'}),
            Post.create({body: 'Post 12'}),
            Post.create({body: 'Post 13'}),
            Post.create({body: 'Post 14'}),
            Post.create({body: 'Post 15'}),
        ])
        .then(() => console.log('Posts added'));
    }
});

// Route
app.get('/users', paginatedResults(User), (req, res) => {
    res.json(res.paginatedResults);
});

app.get('/posts', paginatedResults(Post), (req, res) => {
    res.json(res.paginatedResults);
});

function paginatedResults(models) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        const length = await models.countDocuments().exec();
        console.log('models.length: ' + models.length + ', length: ' + length);
        if (endIndex < length) {
            results.next = page + 1;
        }

        if (startIndex > 0) {
            results.prev = page - 1;
        }

        try {
            results.results = await models.find()
                //.sort({id: 'asc'})
                .limit(limit)
                .skip(startIndex)
                .exec();
            res.paginatedResults = results;
            next();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }        
    }
}

const PORT = 5000;
app.listen(PORT, () => console.log('Server started at port ' + PORT));
