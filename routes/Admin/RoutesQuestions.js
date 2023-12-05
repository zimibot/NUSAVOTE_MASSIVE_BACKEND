const express = require('express');
const routes = express.Router();
const ResAPi = require("../../middleware/CodeResponse")
const validateToken = require('../../middleware/ValidateToken')
const ValidateQuestions = require('../../model/Validate/ValidateQuestions');
const ModelStage = require('../../model/Database/ModelStage');
const ModelQuestion = require('../../model/Database/ModelQuestion');
// Rute utama /users
routes.get('/', validateToken, async (req, res) => {
    // Menampilkan daftar semua user
    try {
        const id = req.query.stageId

        if (!id) {
            return ResAPi.Unauthorized(res, "query stageId Required!")
        }

        const items = await ModelQuestion.find({ stageId: id })

        if (!items) {
            return ResAPi.Unauthorized(res, "Questions Tidak ditemukan")
        }

        return ResAPi.Success(res, "Success", items)

    } catch (error) {
        return ResAPi.Unauthorized()
    }
});
routes.put('/edit', validateToken, ValidateQuestions, async (req, res) => {
    // Menampilkan daftar semua user
    try {
        const id = req.query.id
        const body = req.body

        if (!id) {
            return ResAPi.Unauthorized(res, "query id Required!")
        }

        const items = await ModelQuestion.findByIdAndUpdate(id, {
            $set: body
        })

        return ResAPi.Success(res, "Success", items)

    } catch (error) {
        return ResAPi.Unauthorized()
    }
});
routes.delete('/delete', validateToken, ValidateQuestions, async (req, res) => {
    // Menampilkan daftar semua user
    try {
        const id = req.query.id

        if (!id) {
            return ResAPi.Unauthorized(res, "query id Required!")
        }

        const items = await ModelQuestion.findByIdAndDelete(id)

        return ResAPi.Success(res, "Success", items)

    } catch (error) {
        return ResAPi.Unauthorized()
    }
});
// Rute untuk mengirimkan data tambah user
routes.post('/create', validateToken, ValidateQuestions, async (req, res) => {
    // Menyimpan user baru ke database
    try {

        const data = req.body;
        const question = new ModelQuestion({
            stage: data.stageId,
            content: data.content,
            choice: data.choice,
            correctAnswer: data.correctAnswer,
            score: data.score
        });

        const savedQuestion = await question.save();

        // Menambahkan question ke stage
        const stage = await ModelStage.findById(req.body.stageId);
        stage.questions.push(savedQuestion._id);
        await stage.save();
        return ResAPi.SuccessCreate(res)
    } catch (error) {
        if (error.code === 11000) {
            return ResAPi.ErrorCreate(res, "Question Sudah Pernah Dibuat.")
        }
        return ResAPi.ErrorCreate(res, error)
    }

});


module.exports = routes;



/**
 * @swagger
 * /admin/questions/create:
 *   post:
 *     description: Mengembalikan detail pengguna yang sudah terotentikasi. Memerlukan token JWT untuk otentikasi.
 *     tags: [Admin Pages]
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
 *               stageId:
 *                 type: string
 *                 example: stageId
 *               content:
 *                 type: string
 *                 example: content
 *               correctAnswer:
 *                 type: string
 *                 example: correctAnswer
 *               score:
 *                 type: number
 *                 example: 0
 *               mutiplechoice:
 *                 type: array
 *                 example: [
 *                     {
 *                   title: "Pilihan ganda"
 *                   }
 *                  ]
 *     responses:
 *       200:
 *         description: Detail pengguna berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               stageId:
 *                 type: string
 *                 example: stageId
 *               content:
 *                 type: string
 *                 example: content
 *               correctAnswer:
 *                 type: string
 *                 example: correctAnswer
 *               score:
 *                 type: number
 *                 example: 0
 *       401:
 *         description: Pengguna tidak terotentikasi, token tidak valid atau tidak ada.
 */



/**
 * @swagger
 * /admin/questions?stageId=1:
 *   get:
 *     description: Mengembalikan detail pengguna yang sudah terotentikasi. Memerlukan token JWT untuk otentikasi.
 *     tags: ["Admin Pages"]
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


/**
 * @swagger
 * /admin/questions/edit?id=1:
 *   put:
 *     description: Mengembalikan detail pengguna yang sudah terotentikasi. Memerlukan token JWT untuk otentikasi.
 *     tags: [Admin Pages]
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
 *               stage:
 *                 type: string
 *                 example: stageId
 *               content:
 *                 type: string
 *                 example: content
 *               correctAnswer:
 *                 type: string
 *                 example: correctAnswer
 *               score:
 *                 type: number
 *                 example: 0
 *               mutiplechoice:
 *                 type: array
 *                 example: [
 *                     {
 *                   title: "Pilihan ganda"
 *                   }
 *                  ]
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
/**
 * @swagger
 * /admin/questions/delete?id=1:
 *   delete:
 *     description: Mengembalikan detail pengguna yang sudah terotentikasi. Memerlukan token JWT untuk otentikasi.
 *     tags: [Admin Pages]
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