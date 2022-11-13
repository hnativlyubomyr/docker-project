const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { port, db } = require('./env');
const postsRouter = require('./routers/posts');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors({
    exposedHeaders: ['Content-Length', 'x-total-count'],
}));
app.use('/', postsRouter)

const startServer = () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        console.log(`Mongo_URL: ${db}`);
    })
}

const connectDb = require('./mongoose');

connectDb()
    .on('error', () => console.log('error connection!'))
    .on('disconnected', connectDb)
    .once('open', startServer)








