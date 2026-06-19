const express = require('express');

const router = express.Router(); // ye router jo hai express ka router hai, isse hum apne routes define karenge

const {getAllSongs ,createSong,getSongById,DeleteSong,UpdateSong} = require('../controllers/Song.controller'); // yaha pe hum apne song controller se getAllSongs function ko import karenge taki hum usko apne route me use kar sake

const upload = require('../middleware/upload'); // yaha pe hum apne upload middleware ko import karenge taki hum usko apne route me use kar sake

router.get('/',getAllSongs); // yaha pe hum apne getAllSongs function ko get request ke sath use karenge taki jab bhi koi get request aayegi to wo getAllSongs function ko call karega aur uske andar jo logic hai wo execute hoga

router.post('/',upload.fields([
    {name:'image',maxCount:1}, // yaha pe hum apne upload middleware ke fields method ko use karenge taki hum apne request me image aur audio file ko upload kar sake, yaha pe name ka matlab hai ki ye field ka naam hai aur maxCount ka matlab hai ki is field me maximum kitni files upload kar sakte hai, yaha pe humne 1 set kiya hai kyuki hume sirf ek image aur ek audio file upload karni hai
    {name:'audio',maxCount:1} // yaha pe hum apne upload middleware ke fields method ko use karenge taki hum apne request me image aur audio file ko upload kar sake, yaha pe name ka matlab hai ki ye field ka naam hai aur maxCount ka matlab hai ki is field me maximum kitni files upload kar sakte hai, yaha pe humne 1 set kiya hai kyuki hume sirf ek image aur ek audio file upload karni hai
]),createSong); // yaha pe hum apne createSong function ko post request ke sath use karenge taki jab bhi koi post request aayegi to wo createSong function ko call karega aur uske andar jo logic hai wo execute hoga

router.get('/:id',getSongById); // yaha pe hum apne getSongById function ko get request ke sath use karenge taki jab bhi koi get request aayegi to wo getSongById function ko call karega aur uske andar jo logic hai wo execute hoga, yaha pe :id ka matlab hai ki ye ek dynamic parameter hai, jab bhi koi request aayegi to usme id aayega aur us id ke basis pe hum song ko fetch karenge

router.delete('/:id',DeleteSong); // yaha pe hum apne DeleteSong function ko delete request ke sath use karenge taki jab bhi koi delete request aayegi to wo DeleteSong function ko call karega aur uske andar jo logic hai wo execute hoga, yaha pe :id ka matlab hai ki ye ek dynamic parameter hai, jab bhi koi request aayegi to usme id aayega aur us id ke basis pe hum song ko delete karenge

router.put('/:id',UpdateSong); // yaha pe hum apne UpdateSong function ko put request ke sath use karenge taki jab bhi koi put request aayegi to wo UpdateSong function ko call karega aur uske andar jo logic hai wo execute hoga, yaha pe :id ka matlab hai ki ye ek dynamic parameter hai, jab bhi koi request aayegi to usme id aayega aur us id ke basis pe hum song ko update karenge




module.exports = router; // aur is router ko export karenge taki hum ise apne main app.js me use kar sake