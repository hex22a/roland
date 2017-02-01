import * as db from './service/db'
import mail from './service/mail'
import config from 'config'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export default function (req, res) {
    const { subject, text, html } = req.body;
    const token = req.headers.authorization;

    if (!text) {
        res.status(400);
        res.json({ err: 'No text in request body' })
    }

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
        if (err) {
            res.status(500);
            res.json({ err })
        } else {
            const site = await db.getSite(decoded.id);

            const decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.password);
            let dec = decipher.update(site.SMTPPassword, 'hex', 'utf8');
            dec += decipher.final('utf8');

            mail(site.SMTPLogin, dec, site.destinations, text, html, subject).then(error => {
                if (error) {
                    res.status(500);
                    res.json({ err: error })
                } else {
                    res.json({ foo: null });
                }
            });
        }
    })
}