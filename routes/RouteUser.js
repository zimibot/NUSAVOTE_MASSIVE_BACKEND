



const express = require('express');
const routes = express.Router();
const ModelUser = require("../model/Database/ModelUser");
const resApi = require('../middleware/CodeResponse');
const validateUser = require('../model/Validate/ValidateLogin');
const validate = require('../middleware/Validate');
const validateToken = require("../middleware/ValidateToken")
const argon2 = require('argon2');
var jwt = require('jsonwebtoken');

// Rute utama /users
routes.get('/', (req, res) => {
    // Menampilkan daftar semua user
    return res.status(403).json({ message: "" })
});

// Rute untuk menampilkan form tambah user
routes.get('/detail', validateToken, async (req, res) => {
    // Menampilkan form tambah user
    let items = req.userData

    return resApi.Success(res, "Success", items)
});

// Rute untuk mengirimkan data tambah user
routes.post('/auth/login', validateUser, validate, async (req, res) => {
    // Menyimpan user baru ke database
    try {
        const user = await ModelUser.findOne({ username: req.body.username })
        const verif = await argon2.verify(user.password, req.body.password)

        if (!user) {
            return resApi.Unauthorized(res, "User Tidak ditemukan")
        }

        if (!verif) {
            return resApi.Unauthorized(res, "Password salah")
        }


        var dataToken = jwt.sign({
            username: user.username,
            fullname: user.fullname,
            id: user._id,
            roles: user.roles,
            date_birth: user.date_birth
        }, "c!a898waPL(*(*&sad>?:L&^^^^%$", { expiresIn: '1h' });


        await ModelUser.updateOne({ username: req.body.username }, {
            $set: {
                token: dataToken
            }
        })



        return resApi.Success(res, dataToken)

    } catch (error) {
        console.log(error)
        return resApi.Unauthorized(res)
    }

});

// // Rute untuk menampilkan detail user berdasarkan ID
// routes.get('/:id', (req, res) => {
//     // Menampilkan detail user
// });

// // Rute untuk mengupdate user berdasarkan ID
// routes.put('/:id', (req, res) => {
//     // Mengupdate user
// });

// // Rute untuk menghapus user berdasarkan ID
// routes.delete('/:id', (req, res) => {
//     // Menghapus user
// });

module.exports = routes;

/**
* @swagger
* /users/auth/login:
*   post:
*     description: Menerima username dan password, mengembalikan token jika kredensial valid.
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               username:
*                 type: string
*                 example: funtsu
*               password:
*                 type: string
*                 example: 123
*     responses:
*       200:
*         description: Login sukses, token autentikasi diberikan
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*       400:
*         description: Kredensial tidak valid
*/

/**
 * @swagger
 * /users/detail:
 *   get:
 *     description: Mengembalikan detail pengguna yang sudah terotentikasi. Memerlukan token JWT untuk otentikasi.
 *     tags: [User]
 *     security:
 *     - ApiKeyAuth: []
 *     type: string
 *     responses:
 *       200:
 *         description: Detail pengguna berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Pengguna tidak terotentikasi, token tidak valid atau tidak ada.
 */
