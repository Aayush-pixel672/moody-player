const express = require('express');

const router = express.Router(); // ye router jo hai express ka router hai, isse hum apne routes define karenge

const {getallhistory,addhistory} = require('../controllers/History.controller');

router.get('/',getallhistory); // yaha pe hum apne getallhistory function ko get request ke sath use karenge taki jab bhi koi get request aayegi to wo getallhistory function ko call karega aur uske andar jo logic hai wo execute hoga

router.post('/',addhistory); // yaha pe hum apne addhistory function ko post request ke sath use karenge taki jab bhi koi post request aayegi to wo addhistory function ko call karega aur uske andar jo logic hai wo execute hoga

module.exports = router; // aur is router ko export karenge taki hum ise apne main app.js me use kar sake