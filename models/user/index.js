const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
   email:{
       type:String,
       required:true,
   },
   password:{
    type:String,
    required:true,
},
contactno:{
    type:Number,
    required:true,
},
verified:{
    type:Boolean,
    default:false,
}
},{
    timestamps:true,
});
const User=mongoose.model("users",userSchema);

 module.exports=User;