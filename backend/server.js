const express = require('express');
const cors = require('cors');

require('dotenv').config();

const db = require('./config/db');

const app = express();


app.use(cors());
app.use(express.json());



//Register Routes
//routes for bookController / api
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);


// Register Note
const noteRoutes = require('./routes/noteRoutes');
app.use('/api', noteRoutes);


app.get('/', (req, res) => {
    res.send('Book Management API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});