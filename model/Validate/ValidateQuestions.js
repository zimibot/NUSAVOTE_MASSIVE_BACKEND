const { body } = require('express-validator');

const validate = [
    body('category_id')
        .notEmpty().withMessage('ID Kategori diperlukan.')
        .isMongoId().withMessage('ID Kategori tidak valid.'),

    body('unit_id')
        .notEmpty().withMessage('ID Unit diperlukan.')
        .isMongoId().withMessage('ID Unit tidak valid.'),

    body('stage_id')
        .notEmpty().withMessage('ID Stage diperlukan.')
        .isMongoId().withMessage('ID Stage tidak valid.'),

    body('answer_id')
        .notEmpty().withMessage('ID Jawaban diperlukan.')
        .isMongoId().withMessage('ID Jawaban tidak valid.'),

    body('title')
        .notEmpty().withMessage('Judul diperlukan.'),

    body('content')
        .notEmpty().withMessage('Konten pertanyaan diperlukan.'),

    body('score')
        .isNumeric().withMessage('Nilai harus berupa angka.'),

    body('choice')
        .isArray().withMessage('Pilihan harus berupa array.')
];


module.exports = validate