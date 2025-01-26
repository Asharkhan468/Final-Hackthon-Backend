import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cnic: { type: String, required: true },
  password:{type:String , default:null},
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
});


userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10)
  next()
})
const User = mongoose.model("User", userSchema);

export default User;
