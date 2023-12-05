const { body } = require('express-validator');

const validate = [
    body('stageId').notEmpty().withMessage('ID Stage diperlukan.').isMongoId().withMessage('ID Stage tidak valid.'),
    body('content').notEmpty().withMessage('Konten pertanyaan diperlukan.'),
    body('correctAnswer').notEmpty().withMessage('Jawaban yang benar diperlukan.'),
    body('score').isNumeric().withMessage('Nilai harus berupa angka.'),
    body('choice').isArray().withMessage('Nilai harus berupa array.')
];



module.exports = validate