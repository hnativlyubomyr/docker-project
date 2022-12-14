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
        cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('combined'));
app.use(bodyParser.json());

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

authUser = (username, password, done) => {
    console.log('local-strategy');
    console.log(`username: ${username}`);
    console.log(`password: ${password}`);
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
    console.log('serialize user ---------------->');
    done(null, user._id);
})

passport.deserializeUser((id, done) => {
    console.log(`deserialize: ${id} --------------------->`);
    User.findById(id, function(err,user){
        err
            ? done(err)
            : done(null,user);
    });
})

app.post('/auth/login', function(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        console.log('info:');
        console.log(info);
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(403).send('Incorrect username or password!');
        }

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send({ isAuth: true, user });
        });

    })(req, res, next);
});

app.get('/auth/authorization', (req, res) => {
    console.log('authorization request:');

    console.log('user:');
    console.log(req.user);

    console.log('isAuthenticated:');
    console.log(req.isAuthenticated());

    const user = req.isAuthenticated() ? req.user: null;
    const obj = {
        isAuth: req.isAuthenticated(),
        user,
    }

    res.send(obj);
})

app.get('/auth/logout', function(req, res, next){
    req.session.destroy(function (err) {
        res.send('logout user');
    });
});

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








