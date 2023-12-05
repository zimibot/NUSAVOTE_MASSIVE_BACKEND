const mongoose = require('mongoose');



const stageSchema = new mongoose.Schema({
    name_stage: { type: String, require: true, unique: true },
    question_id: { type: String, require: true, unique: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

module.exports = mongoose.model('Stage', stageSchema);