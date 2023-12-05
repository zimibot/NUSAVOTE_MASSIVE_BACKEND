const mongoose = require('mongoose');

// Define the user schema
const schema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date_birth: { type: Date, require: true },
  token: { type: String, require: true },
  roles: { type: String, require: true },
});

// Create the User model
const User = mongoose.model('User', schema);

module.exports = User;

