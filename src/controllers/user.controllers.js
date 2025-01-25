import jwt from "jsonwebtoken";
import FbUser from "../models/user.models.js"
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import fs from "fs";
import { decode } from "punycode";

const generateAccessToken = (user) => {
    return jwt.sign({ email: user.email, id: user._id}, process.env.ACCESS_TOKEN, { expiresIn: '6h' });
};


//generate refresh token
const generateRefreshToken = (user)=>{
    return jwt.sign({email:user.email},process.env.REFRESH_TOKEN,{
        expiresIn: '7d'
    })
}

// const uploadImgToCloudinary = async (filePath) => {

//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET
//     })
//     try {
//         const uploadResult = await cloudinary.uploader.upload(filePath, {
//           resource_type: "auto",
//         });
//         fs.unlinkSync(filePath);
//         return uploadResult.secure_url;
//       } catch (error) {
//         fs.unlinkSync(filePath);
//         return null;
//       }
// };



const register = async(req,res)=>{
    const {name,email,password} = req.body;
    if(!name) return res.status(404).json({message : "Please enter a name"})       
    if(!email) return res.status(404).json({message : "Please enter a email"})        
    if(!password) return res.status(404).json({message : "Please enter a password"})

    const user = await FbUser.findOne({email: email})   
    if(user) return res.status(400).json({message : "Email already exists"})

    // const imageUrl = await uploadImgToCloudinary(req.file.path)
    const userCreate = await FbUser.create({
        name,
        email,
        password,
        
    })

    res.status(200).json({
        message : "User created successfully",
        data: userCreate,
    })
}



// const login = async (req,res)=>{
//     const {email,password} = req.body;
//     if(!email) return res.status(404).json({message : "Please enter a email"})        
//     if(!password) return res.status(404).json({message : "Please enter a password"})

//     const user = await FbUser.findOne ({email:email})
//     if(!user) return res.status(404).json({message : "User not found"})
    
//     const isPassword = await bcrypt.compare(password, user.password)
//     if(!isPassword) return res.status(404).json({message : "password mismatch"})

//     const access = generateAccessToken(user)
//     const refresh = generateRefreshToken(user)

//     res.cookie('refresh', refresh, {
//         httpOnly: true,
//         secure: false,  
//         sameSite: "strict", 
//     })

//     res.status(200).json({
//         message : "User logged in successfully",
//         access,
//         refresh,
//         data : user
//     })
// }



const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Please enter an email" });
    }
    if (!password) {
        return res.status(400).json({ message: "Please enter a password" });
    }

    try {
        const user = await FbUser.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Token generation
        const access = generateAccessToken(user);
        const refresh = generateRefreshToken(user);

        // Secure cookie setup
        res.cookie('refresh', refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure cookie in production
            sameSite: "strict", 
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Respond to client
        res.status(200).json({
            message: "User logged in successfully",
            access,
            data: { id: user._id, email: user.email, name: user.name } // Avoid sending sensitive data
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};



const logout = async (req,res)=>{
    res.clearCookie('refresh')
    res.status(200).json({message : "User logged out successfully"})
}

const refreshToken = async (req,res)=>{
    const refresh= req.cookies.refresh || req.body.refresh
    if(!refresh) return res.status(401).json({message : "No refresh token found"})
    const decoded = jwt.verify(refresh,process.env.REFRESH_TOKEN)
    const user = await FbUser.findOne({email : decoded.email})
    if(!user) return res.status(403).json({message : "Invalid refresh token"})
    const access = generateAccessToken(user)
    res.status(200).json(
        {
         message: "access token generate",
         accessToken: access,
         user : decoded
        })
}





export {register,login,logout,refreshToken}