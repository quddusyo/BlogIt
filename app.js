const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { postSchema } = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Post = require('./models/post');

// connect to mongodb with options
mongoose.connect('mongodb://localhost:27017/BlogIt', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//connect db
const db = mongoose.connection;
// open db logic, error if cannot connect
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// use ejs-mate engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});
app.get('/posts', catchAsync(async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', { posts })
}));

app.get('/posts/new', (req, res) => {
    res.render('posts/new');
});

app.post('/posts', validatePost, catchAsync(async (req, res) => {
    // if (!req.body.post) throw new ExpressError('Invalid Post Data', 400);
    const post = new Post(req.body.post);
    await post.save();
    res.redirect(`/posts/${post._id}`)
}));

app.get('/posts/:id', catchAsync(async (req, res,) => {
    const post = await Post.findById(req.params.id)
    res.render('posts/show', { post });
}));

app.get('/posts/:id/edit', catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('posts/edit', { post });
}));

app.put('/posts/:id', validatePost, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    res.redirect(`/posts/${post._id}`);
}));

app.delete('/posts/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect('/posts');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Uh Oh, Something Went Wrong'
    res.status(statusCode).render('error', { err });
});


app.listen(3000, () => {
    console.log('Serving on port 3000');
});