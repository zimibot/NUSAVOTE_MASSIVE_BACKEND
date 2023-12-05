const mongoose = require('mongoose');
const choice = new mongoose.Schema({
    title: { type: String, require: true, unique: true },
});
const questionSchema = new mongoose.Schema({
    content: { type: String, require: true, unique: true },
    stageId: { type: String, require: true, unique: true },
    correctAnswer: { type: String, require: true, unique: true },
    score: { type: Number, require: true, default: 0 },
    choice: [choice],
    userAnswers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserAnswer' }]
});

module.exports = mongoose.model('Question', questionSchema);
