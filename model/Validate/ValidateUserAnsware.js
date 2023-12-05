const { body } = require('express-validator');

const validate = [
    body('questionId').notEmpty().withMessage('ID Pertanyaan diperlukan.').isMongoId().withMessage('ID Pertanyaan tidak valid.'),
    body('userId').notEmpty().withMessage('ID User diperlukan.').isMongoId().withMessage('ID User tidak valid.'),
    body('answer').notEmpty().withMessage('Jawaban diperlukan.'),
    body('score').isNumeric().withMessage('Skor harus berupa angka.')
];



module.exports = validate