const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userSchema = require('./server/models/userModel');
const cors = require('cors');
const postSchema = require('./server/models/postModel');
const authMiddleware = require('./server/routes/middleware');
require('dotenv').config()

const app = express();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const URI = process.env.MONGODB_URI;
mongoose.connect(URI, { useNewUrlParser: true }).then(
    () => { console.log('DB : Connected') },
    err => { console.log('ERROR : Cannot connect to DB\n' + err) }
);
mongoose.model('users', userSchema);
mongoose.model('posts', postSchema);
require('./server/controllers/userController');
require('./server/routes/authRoutes')(app);
require('./server/routes/postsRoutes')(app);

const path = require("path")

app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(process.env.PORT || process.env.SV_PORT, () => { console.log(`Server running on PORT : ${process.env.SV_PORT}`) });

module.exports = app;
