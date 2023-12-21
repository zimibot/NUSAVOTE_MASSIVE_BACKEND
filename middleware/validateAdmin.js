const resApi = require("./CodeResponse");

const validate = (req, res, next) => {
    let items = req.userData

    if (items.roles !== "admin") {
        return resApi.Unauthorized(res, "Not admin");
    } else {
        next()
    }
};

module.exports = validate;
