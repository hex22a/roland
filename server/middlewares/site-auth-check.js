import jwt from 'jsonwebtoken';
import { getSite } from '../api/service/db';

export default function (config) {
    return (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(401).end();
        }

        const token = req.headers.authorization;

        // decode the token using a secret key-phrase
        return jwt.verify(token, config.jwtSecret, async (err, decoded) => {
            // the 401 code is for unauthorized status
            if (err) { return res.status(401).end(); }

            const siteId = decoded.id;

            // check if site exists
            try {
                await getSite(siteId);
                return next();
            } catch (e) {
                return res.status(401).end();
            }
        });
    };
}