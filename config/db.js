const mongoose=require("mongoose");

const connectDB=async()=>{
try{
  const con=await mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify:false
    })
console.log(`MongoDb connected:${con.connection.host}`);
}

catch(error){
console.log(error);
}
}

module.exports=connectDB;