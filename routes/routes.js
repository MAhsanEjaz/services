const express = require('express');
const app = express.Router();


const otpGenerator = require('otp-generator');
const Otp = require('../model/otp');
const twilio = require('twilio');

const accountSid = 'AC7c94438f4d0f6ab2744ebd75f9aa7290';
const authToken = 'dff25a73b629f559e82b755632e0b54c';
const twilioPhone = '+15747667611';


const MongoClient = require('mongodb').MongoClient;
const mongodb = require("mongodb");
const client = twilio(accountSid, authToken);



MongoClient.connect(process.env.DATABASE || 'mongodb+srv://kuza:kuza12345@cluster0.kpotsvr.mongodb.net/?retryWrites=true&w=majority', function(err, client) {
  if (err) throw err;
  console.log('Connected to MongoDB!');
  const db = client.db('requestservice');
  const collection = db.collection('request');
  const maintainServiceCollection = db.collection('maintainservice');



  !// category api

  app.get('/api/maintainSerice', function(req, res) {
    maintainServiceCollection.find({}).toArray(function(err, docs) {
      if (err) throw err;
      res.json(docs);
    });
  });

  !// Define the API endpoint here...


  app.get('/api/mycollection', function(req, res) {
    collection.find({}).toArray(function(err, docs) {
      if (err) throw err;
      res.json(docs);
    });
  });





!// sub cat with id


app.get("/categories/:pname/sub-categories", async (req, res) => {
  try {
    // const db = req.app.locals.db;
    const pname = req.params.pname;
    const collection = db.collection('subcategory');
    collection.find({pname}).toArray(function(err, docs) {
      if (err) throw err;
      res.json(docs);
    });
   
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



!// full categories search


app.get('/search', async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    res.status(400).send('Search term is missing');
    return;
  }

  try {
    const client = await MongoClient.connect(process.env.DATABASE||'mongodb+srv://kuza:kuza12345@cluster0.kpotsvr.mongodb.net/?retryWrites=true&w=majority');
    const db = client.db('requestservice');
    const collection = db.collection('subcategory');
    const results = await collection.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    }).toArray();
    res.send(results);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error searching for products');
  }
});


});


!// Generate and send OTP via SMS
app.post('/otp', async (req, res) => {
  const { phone } = req.body;

  try {
    // Generate OTP
    const otp = otpGenerator.generate(6,{ upperCase: false, specialChars:false,
      digits: true,upperCaseAlphabets: false,lowerCaseAlphabets: false });

    // Save OTP to database
    const newOtp = new Otp({ phone, otp });
    await newOtp.save();

    // Send OTP to user via SMS
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhone,
      to: phone
    });

    res.send('OTP sent successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
})

!// otp verify api


app.post('/verify', async (req, res) => {
    const { phone, otp } = req.body;
  
    try {
      // Find OTP in database
      const savedOtp = await Otp.findOne({ phone, otp });
  
      if (!savedOtp) {
        return res.status(400).send('Invalid OTP');
      }
  
      // Verify OTP
      savedOtp.verified = true;
      await savedOtp.save();
  
      res.send('OTP verified successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });



module.exports = app;




