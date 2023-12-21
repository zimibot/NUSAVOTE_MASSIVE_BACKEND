const { body } = require('express-validator');

const validate = [
    body('unit').notEmpty().withMessage('Name diperlukan.'),
    body('category_id').notEmpty().withMessage('category diperlukan.'),
];



module.exports = validate