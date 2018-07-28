const express = require('express');
const multer = require("multer");

const router  = express.Router();
const Post = require('../models/Post');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});


router.post('', multer({storage: storage}).single("image"),(req,res,next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imgPath: url + '/images/' + req.file.filename
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imgPath: createdPost.imgPath
            }

        });
    });
    
});

router.put('/:id',multer({storage: storage}).single("image"),(req,res,next) => {
    let imgPath = req.body.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get('host');
        imgPath =  url + '/images/' + req.file.filename
    }else {

    }
    
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content, 
        imgPath: imgPath
    })
    Post.updateOne({_id: req.params.id}, post).then(result => {
        res.status(200).json({message: 'update successfull'})
    })
})

router.get('',(req,res,next) => {    
    const pageSize = +req.query.pagesize
    const currentPage = +req.query.page
    const postQuery = Post.find()
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery.skip(pageSize * (currentPage - 1))
        .limit(pageSize)
    }
    postQuery.then(posts => {
        fetchedPosts = posts
        return Post.countDocuments();
        }).then(count => {
            res.status(200).json({
                message:'Post fecthed successfully!',
                maxPosts: count,
                posts: fetchedPosts
                
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