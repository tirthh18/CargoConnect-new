const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const coordinatesSchema = require('./Coordinates')

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'agent'], default: 'user' },
  office: {
    address: {type: String, default: null,},
    city: {type: String, default: null,},
    pincode: {type: String, default: null,},
    coordinates: coordinatesSchema,
  },
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return ;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
