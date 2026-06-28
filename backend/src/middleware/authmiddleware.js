const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;  // Get the Authorization header from the request
        if(!authHeader){
            return res.status(401).json({message:"Authorization header missing"}); // ye hume batata h ki authorization header missing h
        }
        const token = authHeader.split(" ")[1]; // iska matlab ye hai ki hume sirf token chahiye 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // iska matlab hai middleware done controller execute 
    }catch(err){
        return res.status(401).json({message:"Invalid token"});
    }
    // Frontend
    //   │
    // Authorization: Bearer Token
    //   │
    //   ▼
    // JWT Middleware
    //   │
    // verify()
    //   │
    // req.user.id
    //   │
    //   ▼
    // Favorite Controller  YE ISKA FLOW HAI
}


module.exports = authMiddleware;