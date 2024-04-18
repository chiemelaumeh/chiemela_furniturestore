import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendDiscount = async (email, subject, code, user, ) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: process.env.HOST,
      service: "gmail",
      port: 465,
      secure: true,
      // logger: true,
      // debug:true,
      secureConnection: false,
      auth: {
        user: "engineerfranklyn@gmail.com",
        pass: process.env.PASS
      },
      tls: {
        rejectUnauthorized: true
      }
    });
    
     await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: `<!DOCTYPE html>
      <html lang="en" >
      <head>
        <meta charset="UTF-8">
        <title>Team2furnitureStore - Refund Decision</title>
        
      
      </head>
      <body>
      <!-- partial:index.partial.html -->
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:800px;overflow:auto;line-height:2">
        <div style="margin:5px ;width:60%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: orangered;text-decoration:none;font-weight:600">Team2FurnitureStore</a>
          </div>
          <p style="font-size:2em">Hi, ${user}</p>
          <p style="font-size:1.2em">Happy birthday, here is your discount code </p>

    
            <div style="solid #eee">
            <a href="" style="font-size:1.4em;color: orangered;text-decoration:none;font-weight:600"> ${code}</a>
          </div>
            
      
          <p style="font-size:0.9em;">Sincerely,<br />Team2FurnitureStore Crew</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            
          </div>
        </div>
      </div>
      <!-- partial -->
        
      </body>
      </html>`,
    });
    

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};