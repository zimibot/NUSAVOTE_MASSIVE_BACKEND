const express = require('express');
const routes = express.Router();
const ResAPi = require("../../middleware/CodeResponse")
const validateToken = require('../../middleware/ValidateToken')
const ModelStage = require('../../model/Database/ModelStage')
const ValidateUnit = require('../../model/Validate/ValidateUnit');
const ModelCategory = require('../../model/Database/ModelCategory');
// Rute utama /users
routes.get('/', async (req, res) => {
    // Menampilkan daftar semua user
    return ResAPi.Notfound(res)
});

// Rute untuk mengirimkan data tambah user
routes.post('/create', validateToken, ValidateUnit, async (req, res) => {
    // Menyimpan user baru ke database
    try {
        const data = req.body;

        const stage = new ModelStage({
            name: data.name_stage,
            category: data.category_id
        });

        const savedStage = await stage.save();
        // Menambahkan stage ke category
        const category = await ModelCategory.findById(data.category_id);
        category.stages.push(savedStage._id);
        await category.save();
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
 * /admin/unit/create:
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
 *               name:
 *                 type: string
 *                 example: name
 *               category:
 *                 type: string
 *                 example: category_id
 *     responses:
 *       200:
 *         description: Detail pengguna berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 
 *               category:
 *                 type: string
 *                 example: category_id
 * 
 *       401:
 *         description: Pengguna tidak terotentikasi, token tidak valid atau tidak ada.
 */
