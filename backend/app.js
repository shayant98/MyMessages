const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-Width, content-type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
    next();
})

app.post('/api/post', (req,res,next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'post added successfully'
    });
});

app.use('/api/post',(req,res,next) => {    
    const posts = [
        {
            id: 'hcbvjbdfbv',
            title: 'First Server-Side Post',
            content:'This is coming from the server'
        },
        {
            id: 'jbvjkdfjvj',
            title: 'First Server-Side Post',
            content:'This is coming from the server'
        },
    ]
    res.status(200).json({
        message:'Post fecthed successfully!',
        posts: posts
    })

});


module.exports = app;