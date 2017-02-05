import path from 'path'
import bodyParser from 'body-parser'
import webpack from 'webpack'
import express from 'express'
import expressSession from 'express-session'
import http from 'http'
import config from 'config'

import passport from 'passport';
import webpackDevMiddleware from 'webpack-dev-middleware';
import authCheckMiddleware from './server/middlewares/auth-check'
import adminCheckMiddleware from './server/middlewares/admin-check'
import siteCheckMiddleware from './server/middlewares/site-auth-check'
import graphqlHTTP from 'express-graphql'

import site from './server/api/sites'
import users, { logIn, logOut } from './server/api/user'
import mail from './server/api/http'
import uni from './server/app'
import * as db from './server/api/service/db'
import webpackConfig from './webpack.config'

import strategies from './server/passport'

const app = express();
const httpServer = http.createServer(app);
const port = config.get('express.port') || 3000;

app.use(webpackDevMiddleware(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
}));
app.use('/api', authCheckMiddleware(config));
app.use('/api/admin', adminCheckMiddleware(config));
app.use('/site/api', siteCheckMiddleware(config));

strategies(config);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUser(id);
        done(null, user);
    } catch (e) {
        done(null, null);
    }
});

app.set('views', path.join(__dirname, 'server', 'view'));
app.set('view engine', 'pug');

app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(expressSession({
    secret: 'gorillaz',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', graphqlHTTP({
    schema: site,
    graphiql: true,
}));

app.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, 'robots.txt')));
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'images', 'favicon.ico')));

/* site api */
app.post('/site/api/v1/mail', mail);

/* api */
app.post('/openapi/v1/login', logIn);
app.get('/logout', logOut);
/* admin api */

/* universal app endpoint */
app.get('*', uni);

httpServer.listen(port);