const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
    try {
          // connect to smtp server
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,   
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }, 
    });
        
    
        const mailOptions = {
        from: {
            name: "Rahul Shanisare",
            address:  process.env.EMAIL, 
        }, 
        to: email,
        subject: "Dating App",
        text:"Email Verification",
        html: `<h1>Email Verification</h1>
        <p>Please click <a href="http://192.168.1.30:3000/verify-email/${token}">here</a> to verify your email.</p>`,
        };
        // send the mail
       transporter.sendMail(mailOptions); 
    } catch (err) {
        console.log("Error sending the verification email", err);
    }
} 
 
module.exports = sendVerificationEmail;