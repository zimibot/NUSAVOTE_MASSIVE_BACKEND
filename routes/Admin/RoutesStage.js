const express = require('express');
const routes = express.Router();
const ResAPi = require("../../middleware/CodeResponse")
const validateToken = require('../../middleware/ValidateToken')
const ModelStage = require('../../model/Database/ModelStage')
const ValidateStage = require('../../model/Validate/ValidateStage');
const ModelUnit = require('../../model/Database/ModelUnit');
const ModelQuestion = require('../../model/Database/ModelQuestion');
const validateAdmin = require('../../middleware/validateAdmin')

// Rute utama /users
routes.get('/', validateToken, validateAdmin, async (req, res) => {

    const category_id = req.query.category_id
    const unit_id = req.query.unit_id
    const items = await ModelStage.find({ unit_id: unit_id, category_id: category_id })

    return ResAPi.Success(res, "Success", items)
});

routes.get('/:id', validateToken, validateAdmin, async (req, res) => {
    const id = req.params.id
    const items = await ModelStage.findById(id)

    return ResAPi.Success(res, "Success", items)
});

routes.delete('/:id/delete/:unit_id', validateToken, validateAdmin, async (req, res) => {
    const id = req.params.id
    const unit_id = req.params.unit_id

    await ModelUnit.findByIdAndUpdate(unit_id, { $inc: { stages: -1 } });
    await ModelStage.findByIdAndDelete(id)
    await ModelQuestion.deleteMany({ stage_id: id })
    return ResAPi.Success(res, "Success Delete")
});

routes.put('/:id/edit', validateToken, validateAdmin, async (req, res) => {
    const id = req.params.id
    const data = req.body
    const items = await ModelStage.findByIdAndUpdate(id, {
        $set: {
            stage: data.stage,
            description: data.description,
        }
    })

    return ResAPi.Success(res, "Success", items)
});

// Rute untuk mengirimkan data tambah user
routes.post('/create', validateToken, validateAdmin, ValidateStage, async (req, res) => {
    // Menyimpan user baru ke database
    try {
        const data = req.body;

        const find = await ModelStage.findOne({ category_id: data.category_id, unit_id: data.unit_id, unit: data.stage })

        if (find) {
            return ResAPi.ErrorCreate(res, "Unit Sudah Pernah Dibuat.");
        }

        const stage = new ModelStage(data);

        await stage.save();

        await ModelUnit.findByIdAndUpdate(data.unit_id, { $inc: { stages: 1 } });


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


