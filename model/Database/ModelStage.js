const mongoose = require('mongoose');



const stageSchema = new mongoose.Schema({
    stage: { type: String, require: true },
    description: { type: String, require: true },
    unit_id: { type: String, require: true },
    category_id: { type: String, require: true },
    soal:{type: Number, default: 0}
});



module.exports = mongoose.model('Stage', stageSchema);