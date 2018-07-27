const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts')

//create app server
const app = express();

//connect to MongoDB
mongoose.connect('mongodb+srv://shayant:AJXdUcozYVkHtXCZ@cluster0-uj0cy.mongodb.net/node-angular?retryWrites=true', { useNewUrlParser: true }).then(() =>{
    console.log('Connected Successfully');
    
}).catch(()=>{
    console.log('Connection Failed');
    
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/images', express.static(path.join("backend/images")));


app.use('/api/post',postRoutes)

module.exports = app;