const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema({
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answer: { type: String, require: true },
    score: Number
});

module.exports = mongoose.model('UserAnswer', userAnswerSchema);