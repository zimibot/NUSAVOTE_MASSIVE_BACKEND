const express = require('express');
const routes = express.Router();
const ResAPi = require("../../middleware/CodeResponse")
const validateToken = require('../../middleware/ValidateToken')
const ValidateQuestions = require('../../model/Validate/ValidateQuestions');
const ModelStage = require('../../model/Database/ModelStage');
const ModelQuestion = require('../../model/Database/ModelQuestion');
const validateAdmin = require('../../middleware/validateAdmin')

// Rute utama /users
routes.get('/:id', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar semua user
    try {
        const stage_id = req.params.id

        const items = await ModelQuestion.find({ stage_id })

        return ResAPi.Success(res, "Success", items)

    } catch (error) {
        return ResAPi.Unauthorized()
    }
});
routes.get('/id/:id', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar semua user
    try {
        const id = req.params.id

        const items = await ModelQuestion.findById(id)

        return ResAPi.Success(res, "Success", items)

    } catch (error) {
        return ResAPi.Unauthorized()
    }
});
routes.delete('/:id/:id_stage/delete', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar semua user
    try {
        const id = req.params.id
        const id_stage = req.params.id_stage
        await ModelStage.findByIdAndUpdate(id_stage, { $inc: { soal: -1 } });
        await ModelQuestion.findByIdAndDelete(id)
        return ResAPi.Success(res, "Success Delete")

    } catch (error) {
        return ResAPi.Unauthorized()
    }
});
routes.put('/:id/edit', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar semua user
    try {
        const id = req.params.id
        const data = req.body
        const items = await ModelQuestion.findByIdAndUpdate(id, {
            $set: data
        })

        return ResAPi.Success(res, "Success", items)

    } catch (error) {
        return ResAPi.Unauthorized()
    }
});

// Rute untuk mengirimkan data tambah user
routes.post('/create', validateToken, validateAdmin, ValidateQuestions, async (req, res) => {
    // Menyimpan user baru ke database
    try {

        const data = req.body;
        const find = await ModelQuestion.findOne({ title: data.title, stage_id: data.stage_id })
        await ModelStage.findByIdAndUpdate(data.stage_id, { $inc: { soal: 1 } });
        if (find) {
            return ResAPi.ErrorCreate(res, "Question Sudah Pernah Dibuat.")
        }
        const question = new ModelQuestion(data);

        await question.save();

        // Menambahkan question ke stage

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