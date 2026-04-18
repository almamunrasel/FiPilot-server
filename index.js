const dotenv=require('dotenv');
dotenv.config();
const express=require('express');
const cors=require('cors');

const connectDB = require('./src/config/db');
const authRoutes=require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionroute');



const app=express();

const PORT = process.env.PORT ||3000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://transaction-client-livid.vercel.app"
  ],
  credentials:true,
}));

app.use(express.json());

//mongodb connection
connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/transactions",transactionRoutes);
app.get('/',(req,res)=>{
  res.send('finpilot server is on');
})
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

app.listen(PORT,()=>{
  console.log(`Server is listening on port ${PORT}`);
})
