const express=require("express");
const bodyParser=require("body-parser")
const app=express();
const dotenv=require("dotenv");

const connectDB = require("./config/db");

dotenv.config({path:"./config/config.env"});
connectDB();
const apiRouter=require("./routes");

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use("/",apiRouter);

app.get("/",(req,res)=>{
    res.send("Its working");
});

app.listen(process.env.PORT || 5000,()=>{
    console.log("server has been started port on 5000");
});