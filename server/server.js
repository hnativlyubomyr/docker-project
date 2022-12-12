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

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('combined'));
app.use(bodyParser.json());

const corsConfig = {
    exposedHeaders: ['Content-Length', 'x-total-count'],
    credential: true,
    origin: true,
}
app.use(cors(corsConfig));
app.options('*', cors(corsConfig))

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    next();
});

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

app.post ("/auth/login", cors(), passport.authenticate('local', {
    successRedirect: "/auth/authorization",
    failureRedirect: "/auth/login",
    session: true,
}))

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








