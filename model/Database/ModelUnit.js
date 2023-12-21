const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    unit: { type: String, require: true },
    category_id: { type: String, require: true },
    description: { type: String, require: true },
    guidebook: { type: String, require: true },
    stages: { type: Number, default: 0 }
});

module.exports = mongoose.model('Unit', unitSchema);