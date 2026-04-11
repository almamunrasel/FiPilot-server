const mongoose=require('mongoose');

const connectDB=async()=>{
  try{
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb connectd at :${con.connection.host}`);

  }
  catch(error){
    console.error(`Monogo db connection error:${error.message}`);
    process.exit(1);

  }
}
module.exports=connectDB;