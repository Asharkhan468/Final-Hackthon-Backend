



// import bcrypt from "bcrypt";
// import User from "../models/userModel.js";
// import nodemailer from "nodemailer"




// // User registration


// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//       user: 'asharullahkhan007@gmail.com',
//       pass: 'ipvr yuzl mgvl rzgw'
//   }
// });
// const registerUser = async (req, res) => {
//   const { name, email, cnic, role } = req.body;

 
  

//   // Generate a random password
//   const password = Math.random().toString(36).slice(-8);

//   try {
//     // Hash the password using bcrypt
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user in the database with the hashed password and role
//     const user = await User.create({ 
//       name, 
//       email, 
//       cnic, 
//       password: hashedPassword,
//       role: role || 'user' 
//     });


// const info = await transporter.sendMail({
//   from: '"Ashar Ullah Khan 👻" asharullahkhan007@gmail.com', // sender address
//   to: email, // recipient's email
//   subject: "Your Account Password ✔", // Subject line
//   text: `Your password is: ${hashedPassword}`, // plain text body
//   html: `<b>Your password is: ${hashedPassword}</b>`, // HTML body
// });

// console.log("Password email sent:", info.messageId);



// res.status(200).json({
//     message : "User created successfully",
//     data: userCreate,
// })



//     res.status(201).json({ 
//       success: true, 
//       message: 'User registered successfully', 
//       user: { 
//         name: user.name, 
//         email: user.email, 
//         cnic: user.cnic,
//         role: user.role // Include role in the response
//       } 
//     });
//   } catch (err) {
//     res.status(400).json({ 
//       success: false, 
//       message: err.message 
//     });
//   }
// };

// export default registerUser;























import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";

// Set up email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'asharullahkhan007@gmail.com',
      pass: 'ipvr yuzl mgvl rzgw'
  }
});

// User registration
const registerUser = async (req, res) => {
  const { name, email, cnic, role } = req.body;

  // Generate a random password
  const password = Math.random().toString(36).slice(-8);

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database with the hashed password and role
    const user = await User.create({ 
      name, 
      email, 
      cnic, 
      password: hashedPassword,
      role: role || 'user' 
    });

    // Send email with the plain password
    const info = await transporter.sendMail({
      from: '"Ashar Ullah Khan 👻" <asharullahkhan007@gmail.com>', // sender address
      to: email, // recipient's email
      subject: "Welcome to Our Platform!", // Subject line
      text: `Hello ${name},\n\nWelcome to our platform! Your account has been successfully created.\n\nYour login password is: ${password}\n\nPlease log in using the provided password.\n\nBest regards,\nAshar Ullah Khan`, // plain text body
      html: `<b>Hello ${name},</b><br><br>Welcome to our platform! Your account has been successfully created.<br><br>Your login password is: <b>${password}</b><br><br>Please log in using the provided password.<br><br>Best regards,<br>Ashar Ullah Khan`, // HTML body
    });

    console.log("Welcome email sent:", info.messageId);

    // Respond to the user
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully. Please check your email to log in.', 
      user: { 
        name: user.name, 
        email: user.email, 
        cnic: user.cnic,
        role: user.role // Include role in the response
      } 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export default registerUser;






