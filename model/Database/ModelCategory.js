const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    unit: { type: Number, default: 0 }
});

module.exports = mongoose.model('Category', categorySchema);