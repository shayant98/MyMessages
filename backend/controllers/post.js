const Post = require('../models/Post');

exports.addPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imgPath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
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
  }).catch(error => {
    res.status(500).json({
      message: 'Creating a post failed!'
    })
  })

}

exports.editPost = (req, res, next) => {
  let imgPath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imgPath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imgPath: imgPath,
    creator: req.userData.userId
  })
  Post.updateOne({
    _id: req.params.id,
    creator: req.userData.userId
  }, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'update successfull'
      });
    } else {
      res.status(401).json({
        message: 'Not Authortized'
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Could not update post!'
    })
  })
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize
  const currentPage = +req.query.page
  const postQuery = Post.find()
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  postQuery.then(posts => {
    fetchedPosts = posts
    return Post.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: 'Post fecthed successfully!',
      maxPosts: count,
      posts: fetchedPosts

    })
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching posts failed!'
    })
  })
}


exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'post not found'
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching post failed!'
    })
  })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'Post Deleted'
      });
    } else {
      res.status(401).json({
        message: 'Failed'
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Unable to delete Post!'
    })
  })
}
