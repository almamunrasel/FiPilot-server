const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const admin=require('../config/firesbase');



const buildAuthResponse=(user,token)=>({

  token,

  user:{
    id:user._id,
    name:user.name,
    email:user.email,
    photoURL:user.photoURL,
    provider:user.provider,
  }

});

const register=async(req,res)=>{
  try{
    const {name,photoURL,email,password}=req.body;
    if(!name  || !email || !password){
      return res.status(400).json({
        message:"you must give all the input"
      })
    }
    const existingUser = await User.findOne({email:email.toLowerCase()});
    if(existingUser){
      return res.status(409).json({
        message:"a user already exists with same email"
      })
    }

    const user = await User.create({
      name,
      email:email.toLowerCase(),
      password,
      photoURL: photoURL || "",
      provider:"local",
    })
    const token = generateToken({ id: user._id, email: user.email });
     res.status(201).json({
      message: "Account created successfully!",
      ...buildAuthResponse(user, token),
    });



  }catch(error){
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });

  }
}

const login=async(req,res)=>{
  try{
    const {email,password}=req.body;
    if (!email || !password) {
       return res.status(400).json({ message: "Email and password are required." });
    }
    const user=await User.findOne({email:email.toLowerCase()}).select("+password");
    if(!user){
       return res.status(401).json({ message: "Invalid email or password." });
    }
    if (user.provider === "google" && !user.password) {
      return res.status(400).json({
      message: "This account uses Google sign-in. Please continue with Google.",
    });
    }

    const isMatch=await user.comparePassword(password);
    if(!isMatch){
       return res.status(401).json({ message: "Invalid email or password." });
    }
    const token=generateToken({id:user._id,email:user.email});
    res.status(200).json({
      message: "Logged in successfully!",
      ...buildAuthResponse(user, token),
    });
  }catch(error){
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });

  }
}


const googleAuth=async(req,res)=>{
    try{
      const {idToken}=req.body;
      if(!idToken){
        return res.status(400).json({
          message:"Firebase token not found!"
        })
      }
      const decodedToken=await admin.auth().verifyIdToken(idToken);
      const {name,email,picture:photoURL}=decodedToken;
      if(!email){
        return res.status(400).json({
          message:"no email found in google account!"
        })
      };
      let user= await User.findOne({email:email.toLowerCase()});
      if(!user){
        user=await User.create({
          name:name || "FinPilot User",
          email:email.toLowerCase(),
          photoURL:photoURL || "",
          provider:"google",
        });
      }else{
        user.name=name || user.name;
        user.photoURL=photoURL || user.photoURL;
        // if(user.provider==="local") user.provider="google";
        await user.save({validateBeforeSave:false});
      }

      //giving our own jwt token

      const token=generateToken({id:user._id,email:user.email});
      console.log('google sign in successfull',token);

      res.status(200).json({

      message: "Google sign-in successful!",
      ...buildAuthResponse(user, token),
    });


     
    }
    catch(error){
      console.error("Google auth error:",error);
      res.status(500).json({
        message:"Google sign in failed.try again!"
      })
    }
}


const getMe=async(req,res)=>{
    try{
      res.status(200).json({
        user:req.user
      });

    }
    catch(error){
      console.error("GetMe error:", error);
      res.status(500).json({ message: "Could not fetch user data." });

    }
}


const updateProfile= async(req,res)=>{
    try{
      const {name,photoURL}=req.body;
      const user=await User.findByIdAndUpdate(
        req.user._id,
        {name,photoURL},
        {new:true,runValidators:true}
      );
      res.status(200).json({
        message:"Profile Updated successfuly",
        user:{
          id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
          provider: user.provider,

        },

      });

    }
    catch(error){
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Profile update failed." });

    }
}


module.exports= {register,login,getMe,googleAuth,updateProfile}  


