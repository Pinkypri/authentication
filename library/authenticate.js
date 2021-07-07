const jwt=require("jsonwebtoken");

async function authenticate(req,res,next){
    try {
        const token=req.headers['authorization']
        const data=await jwt.verify(token,process.env.SECRET_KEY);
        console.log(data);
        req.userId=data.userId;
        next();
        
    } catch (error) {
        return res.json({msg:"Access Denied"});
        
    }
}

module.exports=authenticate