const { body } = require('express-validator');

const validate = [
    body('username').isString().notEmpty(),
    body('password').isString().notEmpty(),
];



module.exports = validate