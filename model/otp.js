const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    phone: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now,
      expires: 300 // OTP expires after 5 minutes (300 seconds)
    },
    verified: {
      type: Boolean,
      default: false
    }
  });
  
  module.exports = mongoose.model('otp',OtpSchema);