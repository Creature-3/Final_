const express = require('express');
const mongoose = require('mongoose');
const uniRoute = require('./routes/uniRouts')
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/uniDB').then(() => console.log('MongoDB connect')).catch(err => console.error('connection error',err))

app.use('/api',uniRoute);


app.listen(3000, console.log('listening on port 3000'))