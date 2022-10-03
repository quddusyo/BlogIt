const mongoose = require('mongoose');
const usernames = require('./usernames');
const Post = require('../models/post');

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/BlogIt', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

//show db is running sucessfully, if not, show the error
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

// seed bd with random information
// delete all saved info from db then repopulate with random values
// create 50 random posts
const seedDB = async () => {
    await Post.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random15 = Math.floor(Math.random() * 15);
        const post = new Post({
            username: `${usernames[random15].username}`,
            total_likes: `${random15}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!'
        })
        await post.save();
    }
}

// close db
seedDB().then(() => {
    mongoose.connection.close();
})