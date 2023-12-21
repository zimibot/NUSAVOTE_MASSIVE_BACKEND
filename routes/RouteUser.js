



const express = require('express');
const routes = express.Router();
const ModelUser = require("../model/Database/ModelUser");
const resApi = require('../middleware/CodeResponse');
const validateUser = require('../model/Validate/ValidateLogin');
const validateToken = require("../middleware/ValidateToken")
const argon2 = require('argon2');
var jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client("437848951156-k83vfrl0kn8ousfv70bdai674fdiu6uf.apps.googleusercontent.com", "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");

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
routes.put('/:id/update', validateToken, async (req, res) => {
    // Menampilkan form tambah user
    const items = req.params.id
    const body = req.body

    const hashedPassword = await argon2.hash(body.password);

    await ModelUser.findByIdAndUpdate(items._id, {
        $set: {
            ...body,
            password: hashedPassword
        }
    })

    return resApi.Success(res, "Berhasil Mengupdate password", items)
});
routes.put('/create-password', validateToken, async (req, res) => {
    // Menampilkan form tambah user
    const items = req.userData
    const body = req.body

    const hashedPassword = await argon2.hash(body.password);

    await ModelUser.findByIdAndUpdate(items._id, {
        $set: {
            password: hashedPassword
        }
    })

    return resApi.Success(res, "Berhasil Mengupdate password", items)
});

const jwtSecret = "12*(4124__A--==++as,MJ";
const redirectUri = 'http://localhost:5173'; // Sesuaikan dengan redirect URI Anda
const audienceId = "437848951156-k83vfrl0kn8ousfv70bdai674fdiu6uf.apps.googleusercontent.com";

const generateJwtToken = (userId) => jwt.sign({ id: userId }, jwtSecret, { expiresIn: '7h' });

routes.post('/auth/google-auth', async (req, res) => {
    const { code, regis } = req.body;

    // Validasi input di sini (opsional)

    try {
        const { tokens } = await client.getToken({ code, redirect_uri: redirectUri });
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: audienceId
        });
        const payload = ticket.getPayload();

        let user = await ModelUser.findOne({ email: payload.email });

        if (!user && regis) {

            user = new ModelUser({ ...payload, fullname: payload.name, username: payload?.name?.replace(" ", "_").toLowerCase() });
            await user.save();
        }

        if (!user) {
            return res.status(401).send("User tidak ditemukan.");
        }

        if (regis) {
            const findUser = await ModelUser.findOne({ email: payload.email })

            if (findUser) {
                return res.status(401).send("User Sudah pernah di buat.");
            }
        }

        const jwtToken = generateJwtToken(user._id);
        return res.status(user ? 201 : 291).json({ token: jwtToken });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Rute untuk mengirimkan data tambah user
routes.post('/auth/login', validateUser, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await ModelUser.findOne({ email });

        if (!user || !(await argon2.verify(user.password, password))) {
            return res.status(401).send("Invalid email or password");
        }

        const jwtToken = jwt.sign({ id: user._id }, "12*(4124__A--==++as,MJ", { expiresIn: '7h' });
        res.status(201).json({ token: jwtToken });
    } catch (error) {
        console.log(error)
        res.status(500).send("Error during traditional login");
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
