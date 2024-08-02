const express = require('express');
const mongoose = require('mongoose');
const uniRoute = require('./routes/uniRouts')
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes')
const errorHandler = require('./middlwares/errorHandler');
const app = express();
const Port = 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/uniDB')
.then(() => console.log('MongoDB connect'))
.catch(err => console.error('connection error',err))

app.use('/api',uniRoute);
app.use('/auth', authRoutes);
app.use('/auth',userRoutes);

app.use(errorHandler)

app.listen(Port, () => {
    console.log(`server running at http://localhost:${Port}`);
});