const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: String,
    username: String,
    description: String,
    likes: Number
});

module.exports = mongoose.model('Post', PostSchema);