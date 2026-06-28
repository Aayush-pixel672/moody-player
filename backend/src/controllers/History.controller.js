const historymodel = require('../models/History.model');

const getallhistory = async(req,res)=>{
    try{
        const history =await historymodel.find({
            userId:req.user.id,
            
        }).populate('songId');
            
         // ye populate kya karega ki songId ke andar jo bhi data hoga wo aa jayega
        const validhistory = history.filter(history => history.songId!==null); // ye filter method se hum valid history ko filter karenge taki hume sirf valid history hi mile
        res.status(200).json(validhistory);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

const addhistory = async(req,res)=>{
    try{
        const history = await historymodel.create({
            userId:req.user.id,
            songId:req.body.songId,
            
        });
        res.status(201).json(history);
    }catch(err){
        res.status(500).json({message: err.message});
    }
    
}

const deletehistory = async(req,res)=>{
    try{
        const history = await historymodel.findOneAndDelete({
            _id:req.params.id,
            userId:req.user.id
            
        });
        if(!history){
            return res.status(404).json({message: "History not found"});
        }
        res.status(200).json({message: "History deleted successfully"});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const deleteAllhistory = async(req,res)=>{
    try{
        await historymodel.deleteMany({userId:req.user.id}); // ye deleteMany method se hum saari history ko delete kar denge 
        res.status(200).json({message: "All history deleted successfully"});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports = {getallhistory,addhistory,deletehistory,deleteAllhistory};



