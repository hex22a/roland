import bcrypt from 'bcrypt';
import Json from 'passport-json';

import jwt from 'jsonwebtoken';

import * as db from '../api/service/db';

export default function (config) {
    const JsonStrategy = Json.Strategy;

    return new JsonStrategy({
        usernameProp: 'user.username',
        passwordProp: 'user.password',
    }, (username, password, done) => {
        process.nextTick(() => {
            const validateUser = (err, user) => {
                if (err) { return done(err); }
                if (!user) { return done(null, null, false, { message: `Unknown user: ${username}` }); }

                if (bcrypt.compareSync(password, user.password)) {
                    const payload = {
                        sub: user.id,
                        role: user.role
                    };

                    const token = jwt.sign(payload, config.jwtSecret);

                    return done(null, token, user);
                }
                return done(null, null, false, { message: 'Invalid username or password...' });
            };

            db.findUserByEmail(username, validateUser);
        });
    });
}