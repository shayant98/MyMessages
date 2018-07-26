const express = require('express');
const router  = express.Router();
const Post = require('../models/Post')

router.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-Width, content-type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
    next();
})

router.post('', (req,res,next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'post added successfully',
            postId: createdPost._id
        });
    });
    
});

router.put('/:id',(req,res,next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    })
    Post.updateOne({_id: req.params.id}, post).then(result => {
        console.log(post);
        
        res.status(200).json({message: 'update successfull'})
    })
})

router.get('',(req,res,next) => {    
    Post.find().then(posts => {
        res.status(200).json({
            message:'Post fecthed successfully!',
            posts: posts
        })
    })
});

router.get('/:id',(req,res,next) => {    
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: 'post not found'});
        }
    })
});

router.delete('/:id',(req,res,next) =>{
    Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: 'Post Deleted'})
    })


    
});

module.exports = router;