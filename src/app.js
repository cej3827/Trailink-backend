const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: [
        'https://trailink-frontend.vercel.app',
        'http://localhost:3000'
    ]
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));

module.exports = app;
