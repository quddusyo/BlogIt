const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    username: String,
    image: String,
    description: String,
    total_likes: Number
});

module.exports = mongoose.model('Post', PostSchema);