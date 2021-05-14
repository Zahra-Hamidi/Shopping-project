const express = require('express');
const productRouter = express.Router();
const data = require('../data');
const expressAsyncHandler = require('express-async-handler');
const productModel = require('../models/productModel');

productRouter.get('/',expressAsyncHandler(async(req,res)=>{
    const products = await productModel.find({});
    res.send(products)
}));

productRouter.get('/seed',expressAsyncHandler(async(req,res)=>{
    //await productModel.remove({})
    const createdProduct = await productModel.insertMany(data.products);
    res.send({createdProduct});
}));

productRouter.get('/:id',expressAsyncHandler(async(req,res)=>{
    const product = await productModel.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({message:'Product Not Found'});
    }
}))

module.exports = productRouter;