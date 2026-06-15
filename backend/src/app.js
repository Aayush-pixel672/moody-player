const express = require('express');
const cors = require('cors');
const app = express();

const songRoutes = require('./routes/Song.routes')
const favoriteRoutes = require('./routes/Favorite.routes')
const historyRoutes = require('./routes/History.routes')

app.use(express.json());
app.use(cors());

app.use('/songs',songRoutes) // yaha pe hum apne song routes ko use karenge taki jab bhi koi request aayegi to wo song routes ke through jayegi
// jo humne songroutes mein api banayai hai post ki use use karne karne ke liye hum app,js mein app.use karenge taki humare main server pe wo api work kare




// app.get("/", (req, res) => {
//   res.send("Backend Running");
// });

app.use('/favorites', favoriteRoutes) // yaha pe hum apne favorite routes ko use karenge taki jab bhi koi request aayegi to wo favorite routes ke through jayegi
// jo humne favoriteroutes mein api banayai hai get ki use use karne karne ke liye hum app,js mein app.use karenge taki humare main server pe wo api work kare

app.use('/history', historyRoutes) // yaha pe hum apne history routes ko use karenge taki jab bhi koi request aayegi to wo history routes ke through jayegi

module.exports = app;