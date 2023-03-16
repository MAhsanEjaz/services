const express = require('express');

const app = express();
const mongoose = require('mongoose');

const Router = require('./routes/routes');





app.use(express.json());


app.use('/routes',Router);




mongoose.connect(process.env.DATABASE||'mongodb+srv://kuza:kuza12345@cluster0.kpotsvr.mongodb.net/?retryWrites=true&w=majority',(err)=>{
    if(!err){
        console.log('Connected');
    }else{
        console.log('Not Connected');
    }
})

// app.get('',(req, res)=>{
//     res.send("WHat is this");
// })

const PORT = process.env.PORT || 4000;


app.listen(PORT)
