const express = require('express');
const routes = express.Router();
const ResAPi = require("../../middleware/CodeResponse")
const validateToken = require('../../middleware/ValidateToken')
const ModelStage = require('../../model/Database/ModelStage')
const ValidateStage = require('../../model/Validate/ValidateStage');
// Rute utama /users
routes.get('/', async (req, res) => {

    const question_id = req.query.question_id
    const items = await ModelStage.find({ question_id })

    return ResAPi.Success(res, "Success", items)
});

// Rute untuk mengirimkan data tambah user
routes.post('/create', validateToken, ValidateStage, async (req, res) => {
    // Menyimpan user baru ke database
    try {
        const data = req.body;

        const stage = new ModelStage({
            name_stage: data.name_stage,
            question_id: data.question_id
        });

        await stage.save();
        return ResAPi.SuccessCreate(res)
    } catch (error) {
        if (error.code === 11000) {
            return ResAPi.ErrorCreate(res, "Stage Sudah Pernah Dibuat.")
        }

        return ResAPi.ErrorCreate(res, error)
    }

});


module.exports = routes;



/**
 * @swagger
 * /admin/stage:
 *   get:
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

/**
 * @swagger
 * /admin/stage/create:
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
 *               name_stage:
 *                 type: string
 *                 example: name_stage
 *               question_id:
 *                 type: string
 *                 example: question_id
 *     responses:
 *       200:
 *         description: Detail pengguna berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               name_stage:
 *                 type: string
 *                 example: name_stage
 *               question_id:
 *                 type: string
 *                 example: question_id
 * 
 *       401:
 *         description: Pengguna tidak terotentikasi, token tidak valid atau tidak ada.
 */


