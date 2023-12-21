const express = require('express');
const routes = express.Router();
const ResAPi = require("../../middleware/CodeResponse")
const validateToken = require('../../middleware/ValidateToken')
const validateAdmin = require('../../middleware/validateAdmin')
const ModelCategory = require('../../model/Database/ModelCategory')
const validateCategory = require('../../model/Validate/ValidateCategory');
const ModelUnit = require('../../model/Database/ModelUnit');
const ModelStage = require('../../model/Database/ModelStage');
const ModelQuestion = require('../../model/Database/ModelQuestion');
// Rute utama /users
routes.get('/', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar semua user
    try {
        const items = await ModelCategory.find()
        return ResAPi.Success(res, "Success", items)
    } catch (error) {
        return ResAPi.Unauthorized()
    }
});

routes.put('/edit', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar semua user
    try {
        let id = req.query.name
        let body = req.body

        await ModelCategory.updateOne({ name: id }, {
            $set: body
        })
        return ResAPi.Success(res, "Success")
    } catch (error) {
        return ResAPi.Unauthorized()
    }
});
routes.delete('/delete', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar semua user
    try {
        let id = req.query.id
        await ModelCategory.findByIdAndDelete(id)
        await ModelUnit.deleteMany({ category_id: id })
        await ModelStage.deleteMany({ category_id: id })
        await ModelQuestion.deleteMany({ category_id: id })
        return ResAPi.Success(res, "Success")
    } catch (error) {
        return ResAPi.Unauthorized()
    }
});

// Rute untuk mengirimkan data tambah user
routes.post('/create', validateToken, validateAdmin, validateCategory, async (req, res) => {
    // Menyimpan user baru ke database
    try {

        const data = req.body;
        const findData = await ModelCategory.findOne(data)
        if (findData) {
            return ResAPi.ErrorCreate(res, "Category Sudah Pernah Dibuat.")
        }
        const category = new ModelCategory(data);
        await category.save();

        return ResAPi.SuccessCreate(res)

    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return ResAPi.ErrorCreate(res, "Category Sudah Pernah Dibuat.")
        }
        return ResAPi.ErrorCreate(res)
    }

});


module.exports = routes;


/**
 * @swagger
 * /admin/category/create:
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
 *                 example: Category
 *     responses:
 *       200:
 *         description: Detail pengguna berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *                name:
 *                 type: string
 *                 example: Category
 *       401:
 *         description: Pengguna tidak terotentikasi, token tidak valid atau tidak ada.
 */


/**
 * @swagger
 * /admin/category:
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
 * /admin/category/edit?id=1:
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
 *               name:
 *                 type: string
 *                 example: Category
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
 * /admin/category/delete?id=1:
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