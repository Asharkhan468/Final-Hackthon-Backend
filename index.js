import express from 'express'
import dotenv from "dotenv";
import connectDB from './src/db/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import authRoutes from "./src/routes/authRoutes.js"
import loanRoutes from "./src/routes/loanRoutes.js"




dotenv.config()


const app = express()


app.use(
  cors({
    origin: 'https://final-hackthon-frontend.vercel.app',
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.json())
app.use(cookieParser())



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/api/loans', loanRoutes);
app.use('/api/auth', authRoutes);



connectDB()
.then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
      });
})
.catch((err)=>{
    console.log("MONGO DB connection failed !!! ", err);
})