




import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cnic: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'user'], 
    default: 'user' 
  }, 
});

const User = mongoose.model('User', userSchema);

export default User;
