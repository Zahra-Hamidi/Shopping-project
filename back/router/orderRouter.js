const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const orderModel = require('../models/orderModel');
const orderRouter = express.Router();
const jwt = require('jsonwebtoken');
// const isAuth = require('../utils')

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

orderRouter.get('/mine',isAuth,expressAsyncHandler(async(req,res)=>{
    const orders = await orderModel.find({user : req.user._id});
    res.send(orders);
}))

orderRouter.post('/',isAuth,expressAsyncHandler(async(req,res)=>{
    if (req.body.orderItems.length === 0) {
        res.status(400).send({message:'Cart is empty'});
    } else {
        const order = new orderModel({
            orderItems : req.body.orderItems,
            shippingAddress : req.body.shippingAddress,
            paymentMethod : req.body.paymentMethod,
            itemsPrice : req.body.itemsPrice,
            shippingPrice:req.body.shippingPrice,
            taxPrice:req.body.taxPrice,
            totalPrice:req.body.totalPrice,
            user:req.user._id,
        });
        const createdOrder = await order.save();
        res.status(201).send({message:'New Order Created',order:createdOrder});
    }
    
}));

orderRouter.get('/:id',isAuth,expressAsyncHandler(async(req,res)=>{
    const order = await orderModel.findById(req.params.id);
    if (order) {
        res.send(order);
    }else{
        res.status(404).send({message : 'Order Not Found'});
    }
}))

module.exports= orderRouter;