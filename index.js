const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const connectDB = require('./src/config/db');
dotenv.config();


const app=express();

const PORT = process.env.PORT ||3001;

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true,
}));

app.use(express.json());

//mongodb connection
connectDB();

app.get('/',(req,res)=>{
  res.send('finpilot server is on');
})

app.listen(PORT,()=>{
  console.log(`Server is listening on port ${PORT}`);
})
