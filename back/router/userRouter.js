const express = require('express');
const data = require('../data');
const bcrypt = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');
// const { generateToken } = require('../utils');
const jwt = require('jsonwebtoken');
const router = express.Router();

const generateToken = (user) =>{
    return jwt.sign({
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin
    },process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}
const isAuth=(req,res,next)=>{
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7,authorization.length);
        console.log(token);
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err,decode)=>{
                if (err) {
                    res.status(401).send({message:'Invalid Token'});
                }else{
                    req.user = decode;
                    next();
                }
            }
        )
    }else{
        res.status(401).send({message:'No Token'});
    }
}
router.get('/seed',expressAsyncHandler(async(req,res)=>{
    //await userModel.remove({})
    const createdUser =await userModel.insertMany(data.users)
    res.send({createdUser});
       
}));

router.post('/signin',expressAsyncHandler(async(req,res)=>{
    const user = await userModel.findOne({email:req.body.email});
    if (user) {
        if (bcrypt.compareSync(req.body.password,user.password)) {
            res.send({
                _id:user._id,
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin,
                token:generateToken(user)
            })
            return;
        }
    }
    res.status(401).send({message:'Invalid email or password'});
}));


router.post('/register',expressAsyncHandler(async(req,res)=>{
    const user = new userModel({
        name:req.body.name,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password,8)
    });
    const userCreated = await user.save();
    res.send({
        _id:userCreated._id,
        name:userCreated.name,
        email:userCreated.email,
        isAdmin:userCreated.isAdmin,
        token:generateToken(userCreated)
    });
}));

router.get('/:id',expressAsyncHandler(async(req,res)=>{
    const user = await userModel.findById(req.params.id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({message:'User Not Found'});
    }
}));

router.put('/profile',isAuth,expressAsyncHandler(async(req,res)=>{
    const user = await userModel.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password , 8);
        }
        const updatedUser = await user.save();
        res.send({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin,
            token:generateToken(updatedUser),
        })
    }
}))


module.exports = router;