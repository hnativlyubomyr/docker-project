const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { port, db } = require('./env');

const postsRouter = require('./routers/posts');
const authRouter = require('./routers/auth');

const User = require('./models/user');

const app = express();
const passport = require('passport');
const session = require('express-session');

const LocalStrategy = require('passport-local').Strategy

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60 * 60 * 1000 },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsConfig = {
    origin: "http://localhost:8080",
    preflightContinue: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ['Content-Length', 'x-total-count'],
};

app.use(cors(corsConfig));

app.use('/', postsRouter);
app.use('/', authRouter);

const errorHandler = (error, req, res, next) => {
    let status = 500;
    let message = 'Internal Sever Error!';

    if (error.code && error.code === 11000) {
        status = 403;
        message = 'Post with that name already exists!'
    }

    if (error.errors) {
        status = 403;
        message = error.message;
    }

    res.status(status).send(message);
}

const authUser = (username, password, done) => {
    User.findOne({ username : username },function(err,user){
        return err
            ? done(err)
            : user
                ? password === user.password
                    ? done(null, user)
                    : done(null, false, { message: 'Incorrect password.' })
                : done(null, false, { message: 'Incorrect username.' });
    });
}

passport.use(new LocalStrategy(authUser));

passport.serializeUser( (user, done) => {
    done(null, user._id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, function(err,user){
        err
            ? done(err)
            : done(null,user);
    });
})

app.use(errorHandler);

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








