const jwt = require("jsonwebtoken");
const resApi = require("./CodeResponse");
const UserModel = require("../model/Database/ModelUser")
const validate = (req, res, next) => {

    const tokenHeader = req.headers.auth;
    jwt.verify(tokenHeader, "c!a898waPL(*(*&sad>?:L&^^^^%$", async (err, decoded) => {
        if (err) {

            // Token tidak valid atau telah kedaluwarsa
            return resApi.Unauthorized(res)
        } else {
            const modelUser = await UserModel.findById(decoded.id)

            const token = tokenHeader?.split(' ')[1] || tokenHeader;



            if (modelUser?.token !== token) {
                return resApi.Unauthorized(res, "Token Expired")
            }

            let {
                fullname,
                _id,
                username,
                date_birth,
                roles
            } = modelUser

            req.userData = {
                fullname,
                _id,
                username,
                date_birth,
                roles
            }
            next();
        }
    });

    // Jika data valid, lanjutkan ke middleware atau handler selanjutnya

}

module.exports = validate