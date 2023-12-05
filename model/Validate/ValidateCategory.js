const { body } = require('express-validator');

const validate = [
    body('name').notEmpty().withMessage('Nama kategori diperlukan.')
];



module.exports = validate