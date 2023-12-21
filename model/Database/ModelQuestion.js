const mongoose = require('mongoose');

const choice = new mongoose.Schema({
    title: { type: String, require: true },
    id: {type: String, require: true}
});

const questionSchema = new mongoose.Schema({
    category_id: { type: String, require: true },
    unit_id: { type: String, require: true },
    stage_id: { type: String, require: true },
    //-------------------------------------
    answer_id: { type: String, require: true },
    title: { type: String, require: true },
    content: { type: String, require: true },
    score: { type: Number, require: true, default: 0 },
    choice: [choice],
});

module.exports = mongoose.model('Question', questionSchema);
