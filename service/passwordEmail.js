const nodemailer = require("nodemailer");

const passwordEmail = async ({ email, firstName, lastName, message }) => {
  let mailTranspoter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });

  let details = {
    from: process.env.USER,
    to: `${email}`,
    subject: "Reset password",
    html: ` <div style="background-color: antiquewhite; margin-left:25%; margin-right:25%; padding:20px;">
      <div>
        <b>Hello ${firstName} ${lastName},</b>
      </div>
      <br>
      <br>
      <div>
        Please click the link to reset your email password; Link will expire in 30m - ${message}
      </div>
      <br>
      <footer style="text-align: center;">
        <b>Thank you</b>
      </footer>
    </div>`,
  };

  mailTranspoter.sendMail(details, (err, data) => {
    if (err) {
      console.log("Error" + err);
    } else {
      console.log("Email send");
    }
  });
};

module.exports = { passwordEmail };
