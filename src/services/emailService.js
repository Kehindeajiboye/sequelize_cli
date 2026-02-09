require('dotenv').config()
const fs = require("fs");
const path = require("path");
const nodemailer = require('nodemailer')
const hbs = require('handlebars')


const readAndSendEmail = async (payload, views) => {
  const pathName = path.join(__dirname, `../views/${views}.hbs`);
  console.log("pattty,", pathName);
  const source = fs.readFileSync(pathName, "utf8");
  const template = hbs.compile(source);
  const result = template(payload);

  return result;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_APP_USER,
    pass: process.env.GMAIL_APP_PASS, // The 16-character App Password
  },
});

const sendMailToUser = async (mailTo, subject, payload, views) => {
    const handlebarsTemplate = await readAndSendEmail(payload, views)

    const mailOptions = {
        from: process.env.GMAIL_APP_USER,
        to: mailTo,
        subject: subject,
        html: handlebarsTemplate
    }

    transporter.sendMail(mailOptions, (error,info) => {
        if (error) {
            console.log("Error sending email:", error)
        } else {
            console.log("Email sent successfully:", info.response)
        }
    })
}

module.exports = {
    sendMailToUser
}