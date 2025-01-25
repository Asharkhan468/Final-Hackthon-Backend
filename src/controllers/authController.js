// import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";

// // User registration
// const registerUser = async (req, res) => {
//   const { name, email, cnic } = req.body;

//   // Generate random password
//   const password = Math.random().toString(36).slice(-8);

//   try {
//     // Create user in the database
//     const user = await User.create({ name, email, cnic, password });

//     res.status(201).json({ 
//       success: true, 
//       message: 'User registered successfully', 
//       user: { name: user.name, email: user.email, cnic: user.cnic } 
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
      role: role || 'user' // Set default role to 'user' if not provided
    });

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
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
