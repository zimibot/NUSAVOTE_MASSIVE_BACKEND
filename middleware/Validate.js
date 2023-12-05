
const { validationResult } = require('express-validator');
const { ErrorCreate } = require('./CodeResponse');

const validate = (req, res, next) => {


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return ErrorCreate(res, ({
            message: "input is required!",
            errors: errors.array()
        }));
    }

    // Jika data valid, lanjutkan ke middleware atau handler selanjutnya

    next();
}

module.exports = validate