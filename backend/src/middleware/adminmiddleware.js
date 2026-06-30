const User = require('../models/User.model');
const adminMiddleware = async(req,res,next)=>{
    try{
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        if(user.role!=="admin"){
            return res.status(403).json({
                message: "Access Denied. Admin Only."
            });
        }
        next();
    }catch(err){
         return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = adminMiddleware