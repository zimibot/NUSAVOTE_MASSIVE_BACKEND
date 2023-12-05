const { body } = require('express-validator');

const validate = [
    body('name').notEmpty().withMessage('Name diperlukan.'),
    body('unit').notEmpty().withMessage('unit diperlukan.').isMongoId().withMessage('unit tidak valid.')
];



module.exports = validate