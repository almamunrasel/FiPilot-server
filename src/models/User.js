const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Your name is Required"],
    trim:true,
    maxlength: [50, "Name cannot exceed 50 characters"],

  },
  email:{
    type: String,
    required:[true,"Your email is Required"],
    unique: true,

    lowercase:true,
    trim:true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
},
  password:{
    type:String,
    minlength:[6,"password must be at least 6 characters "],
    select:false

  },
  photoURL:{
    type:String,
    default:""
  },
  provider:{
    type:String,
    enum:["local","google"],
    default:"local",
  },

},
{
  timestamps:true
})

userSchema.pre("save",async function(){
  if(!this.isModified("password") || !this.password) return;
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
})
//isntance method for pass word matching

userSchema.methods.comparePassword = async function (enteredPassword){
  return bcrypt.compare(enteredPassword,this.password);
}

userSchema.set("toJSON",{
  transform:(doc,ret)=>{
    ret.id=ret._id;
    delete ret._id;
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("User",userSchema);