const express = require('express');
const {urlencoded, json} = require('express');
const router = require('./routes/signos.routes.js');
const cors = require('cors');
const mongoose = require("mongoose");  
require("dotenv").config();

const app = express();

app.use(urlencoded({extended: true}))
app.use(json())

app.use(cors())
app.use('/v1/papa', router);

mongoose
    .connect(process.env.MONGO_URI)  
    .then(() => console.log("Connected to MongoDB Atlas"))  
    .catch((error) => console.error(error)); 

app.listen(4000, ()=>{
    console.log('listening at port 4000');
})