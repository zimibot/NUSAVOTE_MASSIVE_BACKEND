const { body } = require('express-validator');

const validate = [
    body('fullname').isString().notEmpty(),
    body('date_birth').notEmpty(),
    body('username').isString().notEmpty(),
    body('password').isString().notEmpty(),
    body('re-password').isString().notEmpty(),
    body('roles'),
];



module.exports = validate