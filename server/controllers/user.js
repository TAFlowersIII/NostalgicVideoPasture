import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';


export const signin = async (req, res) => {
     const { email, password } = req.body;

     try {
          const existingUser = await User.findOne({ email });
          if(!existingUser) return res.status(404).json({ message: '*Error: User info not found.'})
          const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
          if(!isPasswordCorrect) return res.status(400).json({ message: '*Error: Invalid credentials.'})
          const token = jwt.sign({ email: existingUser.email, id: existingUser._id},  'test', { expiresIn: "4h" });
          res.status(200).json({ result: existingUser, token })

     } catch(error) {
          res.status(500).json({ message: '*Error: Something went wrong. Check console for more information.'});
          console.log(error);
     }
}


export const signup = async (req, res) => {
     const { name, email, password, confirmPassword } = req.body

     try {
          const existingUser = await User.findOne({ email });

          if(existingUser) return res.status(400).json({ message: '*Error: User already exists.'})

          if(password !== confirmPassword) return res.status(400).json({ message: "*Error: Passwords don't match."});

          const hashedPassword = await bcrypt.hash(password, 12);

          const result = await User.create({ email, password: hashedPassword, name});

          const token = jwt.sign({ email: result.email, id: result._id},  'test', { expiresIn: "4h" });

          res.status(200).json({ result, token })

     } catch(error) {
          res.status(500).json({ message: '*Error: Something went wrong. Check console for more information.'});
          console.log(error);
     }
}