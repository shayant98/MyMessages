const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/users')
//create app server
const app = express();

//connect to MongoDB
mongoose.connect('mongodb+srv://shayant:AJXdUcozYVkHtXCZ@cluster0-uj0cy.mongodb.net/node-angular', { useNewUrlParser: true }).then(() =>{
    console.log('Connected Successfully');
    
}).catch(()=>{
    console.log('Connection Failed');
    
});

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-Width, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
    next();
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/images', express.static(path.join("backend/images")));


app.use('/api/post',postRoutes)
app.use('/api/user',userRoutes)


module.exports = app;