const  router=require("express").Router();

const jwt=require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer=require("nodemailer");

const User=require("../../../models").User;

const {authenticate}=require("../../../library");

 router.get("/",(req,res)=>{
     res.send("User Route Is Working");
     });

router.post("/signup",async(req,res)=>{
    try {
    const hash=await bcrypt.hash(req.body.password,10) 
    req.body.password=hash;
        const user=new User(req.body);
        await user.save();
        const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY);
        const transport=nodemailer.createTransport({
            service:"gmail",
            secure:true,
            auth:{
                user:"demo20pri@gmail.com",
                pass:"Demo1245",
             }
        })
        let info= await transport.sendMail({
            from:"demo20pri@gmail.com",
            to:req.body.email,
            subject:"Verification E-mail",
            html:`
            <div>
            <p>Hi <b>${req.body.username}</b>,we welcome you warmly to our platform.</p>
            <p>Please click the below link to verify your email.once verified You can login.</p>
            <a href="https://passreset1.herokuapp.com/api/user/verify/${token}">click here</p>
            </div>`
        });
        if(info){
            console.log(info);
        }
        res.json({msg:"Account Created sucessfully.Check your inbox and verify your account"});
    } catch (error) {
        res.json(error);
    }
});

router.post("/login",async (req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email});
        if(!user.verified){
            return res.json({msg:"Account not verified"});
        }
        const match=await bcrypt.compare(req.body.password,user.password);
        if(match){
            const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY);
            return res.json({token});
        }else{
            res.json({msg:"wrong password"});
        }
    }catch(error){
    }
});



router.get("/data",authenticate, async(req,res)=>{
    try {
        const user=await User.findById({ _id:req.userId}).select("email username contactno-_id");
        
        res.json(user);
    } catch (error) {
        res.json(error);
        
    }
});

router.get("/verify/:token",async(req,res)=>{
    try {
        const data=await jwt.verify(req.params.token,process.env.SECRET_KEY);
        const user=await User.findByIdAndUpdate({_id:data.userId},{verified:true})
         res.send("Account verified.You can login");
    } catch (error) {
        res.json(error);
    }
    

});
var userId="";


router.post("/forgot",async(req,res)=>{
    try {
        const user=await User.findOne(req.body);
    
        if(user==null){
                  res.json("Email is wrong")
        }
        else if(user.verified==true && user.email===req.body.email)
        {
        const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY);
        const transporter=nodemailer.createTransport({
            service:"gmail",
            secure:true,
            auth:{
                user:"demo20pri@gmail.com",
                pass:"Demo1245",
             }
        })
        let info= await transporter.sendMail({
            from:"demo20pri@gmail.com",
            to:req.body.email,
            subject:"Reset Password",
            html:`
            <div>
            <p>Hi <b>${req.body.email}</b></p>
            <p>If you have lost your password or wish to reset it,Use the below link to set Your password</p>
            <a href="https://passreset1.herokuapp.com/api/user/resetp/${token}">click here</p>
            
            </div>`,
        });
        if(info){
            res.json({msg:"check your mail.Reset Your password"});
        }
         }
  
    } catch (error) {
        res.json(error);
    }
});
router.get("/resetp/:token",async(req,res)=>{
    try {
       
        const data=await jwt.verify(req.params.token,process.env.SECRET_KEY);  
        res.sendFile(__dirname+"/index.html");
        userId=data.userId
        return userId
       
    } catch (error) {
        res.json(error);
    }
});


router.post("/reset",async(req,res)=>{
   
    try{
       
     var newpass=req.body.newpass;
     var confirmpass=req.body.confirmpass;
      
if(newpass===confirmpass){
     const hash=await bcrypt.hash(confirmpass,10) 
     confirmpass=hash;
const user=await User.findByIdAndUpdate({_id:userId},{password:confirmpass})
     res.send("Password is saved you can login");
    }
else{
    res.send("password does not match");
}
  }catch(error){
      return res.json({msg: error.message});
  }
 });
  
module.exports=router;