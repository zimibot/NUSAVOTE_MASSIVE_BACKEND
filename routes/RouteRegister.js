const express = require('express');
const routes = express.Router();
const ResAPi = require("../middleware/CodeResponse")
const ModelUser = require("../model/Database/ModelUser");
const validateRegister = require('../model/Validate/ValidateRegister');
const validate = require('../middleware/Validate');
const resApi = require('../middleware/CodeResponse');
const argon2 = require('argon2');

// Rute utama /users
routes.get('/', async (req, res) => {
    // Menampilkan daftar semua user
    return ResAPi.Notfound(res)
});

// Rute untuk mengirimkan data tambah user
routes.post('/create', validateRegister, validate, async (req, res) => {
    // Menyimpan user baru ke database
    try {

        let data = req.body

        const hashedPassword = await argon2.hash(data.password);
        const findUser = await ModelUser.findOne({ username: data.username, email: data.email })

        if (findUser) {
            return resApi.ErrorCreate(res, "User Sudah Pernah Dibuat.")
        }
        data = {
            ...data,
            password: hashedPassword
        }
        const user = new ModelUser(data)
        await user.save()
        return ResAPi.SuccessCreate(res)
    } catch (error) {
        if (error.code === 11000) {
            return resApi.ErrorCreate(res, "User Sudah Pernah Dibuat.")
        }
        return ResAPi.ErrorCreate(res)
    }
});


module.exports = routes;

/**
 * @swagger
 * /register/create:
 *   post:
 *     description: Mengembalikan detail pengguna yang sudah terotentikasi. Memerlukan token JWT untuk otentikasi.
 *     tags: [Register]
 *     security:
 *     - ApiKeyAuth: []
 *     type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_birth:
 *                 type: string
 *                 example: 2023-12-04T19:15:46.329+00:00
 *               fullname:
 *                 type: string
 *                 example: Harris
 *               username:
 *                 type: string
 *                 example: funtsu
 *               roles:
 *                 type: string
 *                 example: 123
 *               re-password:
 *                 type: string
 *                 example: 123
 *               password:
 *                 type: string
 *                 example: 123
 *     responses:
 *       200:
 *         description: Detail pengguna berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               date_birth:
 *                 type: string
 *                 example: 2023-12-04T19:15:46.329+00:00
 *               fullname:
 *                 type: string
 *                 example: Harris
 *               username:
 *                 type: string
 *                 example: funtsu
 *               roles:
 *                 type: string
 *                 example: 123
 *               re-password:
 *                 type: string
 *                 example: 123
 *               password:
 *                 type: string
 *                 example: 123
 *       401:
 *         description: Pengguna tidak terotentikasi, token tidak valid atau tidak ada.
 */
