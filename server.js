const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const userSchema = require('./server/models/userModel');
require('dotenv').config()

const app = express();

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const URI = process.env.MONGODB_URI;
mongoose.connect(URI, { useNewUrlParser: true }).then(
    () => { console.log('DB : Connected') },
    err => { console.log('ERROR : Can not connect to DB\n' + err) }
);
mongoose.model('users', userSchema);
require('./server/controllers/userController');
require('./server/routes/userRoutes')(app);

app.listen(process.env.SV_PORT, () => { console.log(`Server running on PORT : ${process.env.SV_PORT}`) });

module.exports = app;