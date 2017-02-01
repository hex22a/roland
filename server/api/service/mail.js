/**
 * Created by x22a on 21.10.16.
 * mailer
 */
import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import config from 'config'

let smtpConfig = {
    host: config.mail.server,
    port: config.mail.port,
    secure: true // use SSL
};

export default async function (login, password, destinations, textMessage, htmlMessage, subject) {
    smtpConfig = { ...smtpConfig, auth: { user: login, pass: password } };

    let html = htmlMessage;
    let subj = subject;

    if (!html) {
        html = textMessage;
    }

    if (!subj) {
        subj = 'This is Roland E-Mail';
    }

    const mailData = {
        from: login,
        to: destinations,
        subject: subj,
        text: textMessage,
        html
    };

    const transporter = nodemailer.createTransport(smtpTransport(smtpConfig));

    await transporter.verify();
    await transporter.sendMail(mailData, sendingError => {
        if (sendingError) {
            throw new Error(sendingError);
        }
    });
}