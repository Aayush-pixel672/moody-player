const express = require('express');

const router = express.Router(); // ye router jo hai express ka router hai, isse hum apne routes define karenge

const {getAllFavorites,addFavorite,deleteFavorite} = require('../controllers/Favorite.controller'); // yaha pe hum apne favorite controller se getAllFavorites function ko import karenge taki hum usko apne route me use kar sake

const authMiddleware = require('../middleware/authmiddleware');

router.get('/',authMiddleware,getAllFavorites); // yaha pe hum apne getAllFavorites function ko get request ke sath use karenge taki jab bhi koi get request aayegi to wo getAllFavorites function ko call karega aur uske andar jo logic hai wo execute hoga

router.post('/',authMiddleware,addFavorite); // yaha pe hum apne addFavorite function ko post request ke sath use karenge taki jab bhi koi post request aayegi to wo addFavorite function ko call karega aur uske andar jo logic hai wo execute hoga

router.delete('/:id',authMiddleware,deleteFavorite); // yaha pe hum apne deleteFavorite function ko delete request ke sath use karenge taki jab bhi koi delete request aayegi to wo deleteFavorite function ko call karega aur uske andar jo logic hai wo execute hoga, yaha pe :id ka matlab hai ki ye ek dynamic parameter hai, jab bhi koi request aayegi to usme id aayega aur us id ke basis pe hum favorite ko delete karenge

module.exports = router; // aur is router ko export karenge taki hum ise apne main app.js me use kar sake





