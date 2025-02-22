// Filename - index.js

const nodemailer = require('nodemailer');

let mailTransporter =
    nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        }
    );

const sendMail = (email, subject, html) => {
    let mailDetails = {
        from: 'mayur320.rejoice@gmail.com',
        to: email,
        subject: subject,
        html: html
    };

    mailTransporter
        .sendMail(mailDetails,
            function (err, data) {
                if (err) {
                    console.log('Error Occurs');
                } else {
                    console.log('Email sent successfully');
                    return true
                }
            });

}

module.exports = { sendMail }