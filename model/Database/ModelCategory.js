const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    stages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' }]
});

module.exports = mongoose.model('Category', categorySchema);