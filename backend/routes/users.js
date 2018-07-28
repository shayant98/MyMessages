const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req,res,next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(result => {
            res.status(200).json({
                message: 'user created!',
                result: result
            });
        })
        
    });

});


router.post('/login', (req, res, next) => {
    let fetchedUser;

    User.findOne({
        email: req.body.email
    }).then(user => {
        if(!user){
            return res.status(401).json({
                message: 'Login Failed!'
            })
        }
        fetchedUser = user;
       return bcrypt.compare(req.body.password, user.password)
    }).then(result => {
        
        if(!result){
            return res.status(401).json({
                message: 'Login Failed!'
            })
        }
        const token = jwt.sign({
            email: fetchedUser.email, userId: fetchedUser._id}, 
            'secret_this_should_be_longer', 
            {expiresIn: '1h'}
        );
        
        res.status(200).json({
            token: token
        })

    }).catch(err => {
        console.log(err);
        return res.status(401).json({
            message: 'Login Failed!'
        })
    })
})



module.exports = router;