const express = require('express');

const router = express.Router(); // ye router jo hai express ka router hai, isse hum apne routes define karenge

const {getallhistory,addhistory,deletehistory,deleteAllhistory} = require('../controllers/History.controller');
const authMiddleware = require('../middleware/authmiddleware')

router.get('/',authMiddleware,getallhistory); // yaha pe hum apne getallhistory function ko get request ke sath use karenge taki jab bhi koi get request aayegi to wo getallhistory function ko call karega aur uske andar jo logic hai wo execute hoga

router.post('/',authMiddleware,addhistory); // yaha pe hum apne addhistory function ko post request ke sath use karenge taki jab bhi koi post request aayegi to wo addhistory function ko call karega aur uske andar jo logic hai wo execute hoga

router.delete('/:id',authMiddleware,deletehistory); // yaha pe hum apne deletehistory function ko delete request ke sath use karenge taki jab bhi koi delete request aayegi to wo deletehistory function ko call karega aur uske andar jo logic hai wo execute hoga

router.delete('/',authMiddleware,deleteAllhistory); // yaha pe hum apne deleteAllhistory function ko delete request ke sath use karenge taki jab bhi koi delete request aayegi to wo deleteAllhistory function ko call karega aur uske andar jo logic hai wo execute hoga

module.exports = router; // aur is router ko export karenge taki hum ise apne main app.js me use kar sake