import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Set up email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "asharullahkhan007@gmail.com",
    pass: "ipvr yuzl mgvl rzgw",
  },
});

const registerUser = async (req, res) => {
  const { name, email, cnic, role } = req.body;

  // Generate a random password
  const randomPassword = Math.random().toString(36).slice(-8);

  try {
    // Hash the password

    // Create user in the database
    const user = await User.create({
      name,
      email,
      cnic,
      password: randomPassword,
      role: role || "user",
    });

    // Send email with the plain password
    try {
      const info = await transporter.sendMail({
        from: '"Ashar Ullah Khan 👻" <asharullahkhan007@gmail.com>',
        to: email,
        subject: "Welcome to Our Platform!",
        text: `Hello ${name},\n\nWelcome to our platform! Your account has been successfully created.\n\nYour login password is: ${randomPassword}\n\nPlease log in using the provided password.\n\nBest regards,\nAshar Ullah Khan`,
        html: `<b>Hello ${name},</b><br><br>Welcome to our platform! Your account has been successfully created.<br><br>Your login password is: <b>${randomPassword}</b><br><br>Please log in using the provided password.<br><br>Best regards,<br>Ashar Ullah Khan`,
      });

      console.log("Welcome email sent:", info.messageId);
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to send the welcome email.",
      });
    }

    // Respond to the client
    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email to log in.",
      user: {
        name: user.name,
        email: user.email,
        cnic: user.cnic,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//login user

const loginUser = async (req, res) => {
  const { cnic, password } = req.body;

  // Input validation
  if (!cnic || !password) {
    return res.status(400).json({
      success: false,
      message: "CNIC and password are required",
    });
  }

  try {
    // Find the user by CNIC
    const user = await User.findOne({ cnic });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare the password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Create a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN, // Make sure to set your JWT secret in .env file
      { expiresIn: "10h" } // Token expiration time
    );

    // Respond with the user data and token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        cnic: user.cnic,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { registerUser, loginUser };
