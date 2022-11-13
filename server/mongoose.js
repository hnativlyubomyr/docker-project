const mongoose = require('mongoose');
const { db } = require('./env');

const connectDB = () => {
    mongoose.connect(db, { useNewUrlParser: true });

    return mongoose.connection;
}

module.exports = connectDB;
