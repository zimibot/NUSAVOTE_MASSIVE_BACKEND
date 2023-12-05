const express = require('express');
const routes = express.Router();
const ResAPi = require("../../middleware/CodeResponse")
const validateToken = require('../../middleware/ValidateToken')
const ValidateUserAnsware = require('../../model/Validate/ValidateUserAnsware');
const ModelUserAnsware = require('../../model/Database/ModelUserAnsware');
const ModelQuestion = require('../../model/Database/ModelQuestion');
// Rute utama /users
routes.get('/', async (req, res) => {
    // Menampilkan daftar semua user
    return ResAPi.Notfound(res)
});

// Rute untuk mengirimkan data tambah user
routes.post('/create', validateToken, ValidateUserAnsware, async (req, res) => {
    // Menyimpan user baru ke database
    try {
        const userAnswer = new ModelUserAnsware({
            question: req.body.questionId,
            user: req.body.userId,
            answer: req.body.answer,
            score: req.body.score
        });

        const savedUserAnswer = await userAnswer.save();

        // Menambahkan userAnswer ke question
        const question = await ModelQuestion.findById(req.body.questionId);
        question.userAnswers.push(savedUserAnswer._id);
        await question.save();


        return ResAPi.SuccessCreate(res)
    } catch (error) {
        if (error.code === 11000) {
            return ResAPi.ErrorCreate(res, "Nilai Sudah Pernah Dibuat.")
        }
        return ResAPi.ErrorCreate(res)
    }

});


module.exports = routes;


/**
 * @swagger
 * /users/answare/create:
 *   post:
 *     description: Mengembalikan detail pengguna yang sudah terotentikasi. Memerlukan token JWT untuk otentikasi.
 *     tags: [Users Pages]
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
 *               question:
 *                 type: string
 *                 example: questionId
 *               user:
 *                 type: string
 *                 example: userId
 *               answer:
 *                 type: string
 *                 example: answer
 *               score:
 *                 type: string
 *                 example: score
 *     responses:
 *       200:
 *         description: Detail pengguna berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: questionId
 *               user:
 *                 type: string
 *                 example: userId
 *               answer:
 *                 type: string
 *                 example: answer
 *               score:
 *                 type: string
 *                 example: score
 *       401:
 *         description: Pengguna tidak terotentikasi, token tidak valid atau tidak ada.
 */


