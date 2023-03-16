const express = require('express');

const app = express();
const mongoose = require('mongoose');

const Router = require('./routes/routes');





app.use(express.json());


app.use('/routes',Router);




mongoose.connect(process.env.DATABASE,(err)=>{
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
