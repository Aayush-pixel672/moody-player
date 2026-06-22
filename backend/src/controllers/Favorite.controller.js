const Favorite = require('../models/Favorite.model');

const getAllFavorites = async(req,res)=>{
    try{
       const favorites = await Favorite.find().populate('songId'); // ye find method se hum saare favorites ko fetch karenge aur populate method se hum songId ko populate karenge taki hume song ka pura data mil jaye
       const validFavorites = favorites.filter(favorite => favorite.songId !== null); // ye filter method se hum valid favorites ko filter karenge taki hume sirf valid favorites hi mile

       res.status(200).json(validFavorites); // aur is validFavorites ko json format me response me bhej denge 
    }catch(error){
        res.status(500).json({message: error.message}); // agar koi error aata hai to usko catch block me catch karenge aur usko json format me response me bhej denge
    }
}

const addFavorite = async(req,res)=>{
    try{
        const existingFavorite = await Favorite.findOne({
            songId: req.body.songId // ye findOne method se hum check karenge ki kya ye song already favorite me hai ya nahi, yaha pe req.body.songId se hum songId ko fetch karenge jo request body me aayega
        });
        if(existingFavorite){
            return res.status(400).json({message: 'Song is already in favorites'}); // agar ye song already favorite me hai to usko 400 status code ke sath json format me response me bhej denge
        }
        const favorite = await Favorite.create(req.body);  // ye create method se hum ek naya favorite create karenge aur usko database me save karenge
        res.status(201).json(favorite); // aur is favorite ko json format me response me bhej denge

    }catch(error){
        res.status(500).json({message: error.message}); // agar koi error aata hai to usko catch block me catch karenge aur usko json format me response me bhej denge
    }
}



const deleteFavorite = async(req,res)=>{
    try{
        const favorite = await Favorite.findByIdAndDelete(req.params.id); // ye findByIdAndDelete method se hum ek favorite ko delete karenge aur usko database se delete kar denge, yaha pe req.params.id se hum id ko fetch karenge jo url me aayega
        if(!favorite){
            return res.status(404).json({message: 'Favorite not found'}); // agar favorite nahi milta hai to usko 404 status code ke sath json format me response me bhej denge
        }
        res.status(200).json({message: 'Favorite deleted successfully'}); // aur agar favorite delete ho jata hai to usko 200 status code ke sath json format me response me bhej denge
    
    }catch(error){
        res.status(500).json({message: error.message}); // agar koi error aata hai to usko catch block me catch karenge aur usko json format me response me bhej denge
    }
}


module.exports = {getAllFavorites,addFavorite,deleteFavorite}; // aur is getAllFavorites function ko export karenge taki hum ise apne routes me use kar sake