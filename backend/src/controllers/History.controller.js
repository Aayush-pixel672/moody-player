const historymodel = require('../models/History.model');

const getallhistory = async(req,res)=>{
    try{
        const history =await historymodel.find().populate('songId'); // ye populate kya karega ki songId ke andar jo bhi data hoga wo aa jayega
        res.status(200).json(history);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

const addhistory = async(req,res)=>{
    try{
        const history = await historymodel.create(req.body);
        res.status(201).json(history);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

module.exports = {getallhistory,addhistory};



