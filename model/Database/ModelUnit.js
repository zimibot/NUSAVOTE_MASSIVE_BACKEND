const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    content: { type: String, require: true },
    guide: { type: String, require: true },
    stages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stage' }]
});

module.exports = mongoose.model('Unit', categorySchema);