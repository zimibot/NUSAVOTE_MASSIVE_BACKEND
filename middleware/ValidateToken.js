const jwt = require("jsonwebtoken");
const resApi = require("./CodeResponse");
const UserModel = require("../model/Database/ModelUser");

const validate = (req, res, next) => {
    const jwtSecret = "12*(4124__A--==++as,MJ";

    const tokenHeader = req.headers.authorization;

    if (!tokenHeader) {
        // No token provided
        return resApi.Unauthorized(res, "No token provided");
    }

    jwt.verify(tokenHeader, jwtSecret, async (err, decoded) => {
        console.log(decoded)
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Token has expired
                return resApi.Unauthorized(res, "Token Expired");
            } else if (err.name === 'JsonWebTokenError') {
                // Token is invalid
                return resApi.Unauthorized(res, "Invalid Token");
            } else {
                // Other JWT-related error
                return resApi.Unauthorized(res, "Authentication Failed");
            }
        } else {
            try {
                const modelUser = await UserModel.findById(decoded.id);
                if (!modelUser) {
                    return resApi.Unauthorized(res, "User not found");
                }

                let { fullname, _id, username, date_birth, roles } = modelUser;

                req.userData = { fullname, _id, username, date_birth, roles };
                next();
            } catch (error) {
                // Handle database or other errors
                return resApi.InternalServerError(res);
            }
        }
    });
};

module.exports = validate;
