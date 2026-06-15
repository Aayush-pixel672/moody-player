const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    songId:{
        type: mongoose.Schema.Types.ObjectId,// ye type hai mongoose ka ObjectId, iska matlab hai ki ye ek reference hoga kisi aur document ka
        ref: 'Song', // ye ref hai jiska matlab hai ki ye reference kis collection ka hai, yaha pe humne 'Song' diya hai, iska matlab hai ki ye reference Song collection ka hoga
        required: true // ye required hai, iska matlab hai ki ye field mandatory hai, agar is field ko provide nahi kiya gaya to error aayega
    }

    
},{
    timestamps: true // ye timestamps hai, iska matlab hai ki ye automatically createdAt aur updatedAt fields ko add kar dega aur unhe update kar dega jab bhi document create ya update hoga
});

module.exports = mongoose.model('Favorite',FavoriteSchema); // aur is FavoriteSchema ko model me convert kar ke export karenge taki hum ise apne controllers me use kar sake