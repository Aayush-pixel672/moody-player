const Song = require('../models/Song.model'); // isse humare pass Song aaya hai matlab song ka db hai ye
const imagekit = require('../config/imagekit');
// get all songs
const getAllSongs = async (req,res)=>{
    try {
        const songs = await Song.find(); // ye find method se hum apne database se sare songs ko fetch karenge
        res.status(200).json(songs); // aur phir un songs ko json format me response me bhejenge
    }
    catch(error){
        res.status(500).json({message: error.message}); // agar koi error aata hai to usko catch karenge aur 500 status code ke sath error message bhejenge
    }
}

const createSong = async (req,res)=>{
    try{
        const imageFile = req.files.image[0]; // ye req.files se hum apne request me jo files aayi hai usme se image file ko access karenge, yaha pe image ka matlab hai ki ye field ka naam hai jo humne apne route me define kiya hai aur [0] ka matlab hai ki ye first file ko access karega kyuki humne maxCount 1 set kiya hai
        const audioFile = req.files.audio[0]; // ye req.files se hum apne request me jo files aayi hai usme se audio file ko access karenge, yaha pe audio ka matlab hai ki ye field ka naam hai jo humne apne route me define kiya hai aur [0] ka matlab hai ki ye first file ko access karega kyuki humne maxCount 1 set kiya hai
        
        const imageResponse = await imagekit.upload({
            file: imageFile.buffer, // ye image file ka buffer hai jo humne access kiya hai
            fileName: imageFile.originalname, // ye image file ka original name hai jo humne access kiya hai    
        })
        const audioResponse = await imagekit.upload({
            file:audioFile.buffer, // ye audio file ka buffer hai jo humne access kiya hai
            fileName:audioFile.originalname, // ye audio file ka original name hai jo humne access kiya hai
        })
        
        const song = await Song.create({
            title: req.body.title,
            artist: req.body.artist,
            mood: req.body.mood,
            image: imageResponse.url,
            audio: audioResponse.url,
        });
        
        return res.status(201).json(song); // aur phir us song ko json format me response me bhejenge, 201 status code ka matlab hai ki resource successfully created hai
    }catch(error){
        res.status(500).json({message: error.message}); // agar koi error aata hai to usko catch karenge aur 500 status code ke sath error message bhejenge
    }
}

const getSongById = async (req,res)=>{
    try{
        const song = await Song.findById(req.params.id); // ye findById method se hum apne database se ek specific song ko fetch karenge, req.params.id me jo id aayegi usko use karenge
        if(!song){
            return res.status(404).json({message: "Song not found"}); // agar song nahi milta hai to 404 status code ke sath error message bhejenge
        }
        res.status(200).json(song); // aur phir us song ko json format me response me bhejenge


    }catch(error){
        res.status(500).json({message: error.message}); // agar koi error aata hai to usko catch karenge aur 500 status code ke sath error message bhejenge
    }
}

const DeleteSong = async(req,res)=>{
    try{
        const songdelete = await Song.findByIdAndDelete(req.params.id);
        if(!songdelete){
            return res.status(404).json({message: "Song not found"});
        }
        res.status(200).json({message: "Song deleted successfully"});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

const UpdateSong = async(req,res)=>{
    try{
        const song = await Song.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true, runValidators:true} // ye options hai, new:true ka matlab hai ki updated song ko return karega, runValidators:true ka matlab hai ki validation rules ko run karega
        )
        if(!song){
            return res.status(404).json({message: "Song not found"});
        }
        res.status(200).json(song);
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAllSongs,
    createSong,
    getSongById,
    DeleteSong,
    UpdateSong,
}