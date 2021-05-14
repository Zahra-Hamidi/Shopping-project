const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./router/userRouter');
const productRouter = require('./router/productRouter');
const orderRouter = require('./router/orderRouter');

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/amazona', 
{
useNewUrlParser: true, 
useUnifiedTopology: true,
useCreateIndex:true
});

app.use('/api/users',userRouter);
app.use('/api/products',productRouter);
app.use('/api/orders',orderRouter);
app.use((err,req,res,next)=>{
    res.status(500).send({message: err.message})
})
const port =  process.env.PORT || 5000
app.listen(port,()=>{
    console.log('Server is ready')
})