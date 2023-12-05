const { body } = require('express-validator');

const validate = [
    body('name').notEmpty().withMessage('Name diperlukan.'),
    body('category').notEmpty().withMessage('category diperlukan.'),
];



module.exports = validate