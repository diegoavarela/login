const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures that each username is unique in the database
    trim: true, // Removes whitespace from the beginning and end of the string
    minlength: 3, // Minimum length of the username
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum length of the password for basic security
  },
  // Add additional fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;
