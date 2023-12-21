const express = require('express');
const routes = express.Router();
const ResAPi = require("../../middleware/CodeResponse")
const validateToken = require('../../middleware/ValidateToken')
const ValidateUnit = require('../../model/Validate/ValidateUnit');
const ModelCategory = require('../../model/Database/ModelCategory');
const ModelUnit = require('../../model/Database/ModelUnit');
const ModelQuestion = require('../../model/Database/ModelQuestion');
const ModelStage = require('../../model/Database/ModelStage');
const validateAdmin = require('../../middleware/validateAdmin')


// Rute utama /users
routes.get('/', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar semua user
    const id = req.query.category_id
    if (!id) {
        return ResAPi.Unauthorized(res, "category_id is required");
    }

    const findUnit = await ModelUnit.find({ category_id: id })

    return ResAPi.Success(res, "Success", findUnit)
});

routes.get('/id', validateToken, validateAdmin, async (req, res) => {

    try {
        // Menampilkan daftar semua user
        const id = req.query.id

        if (!id) {
            return ResAPi.Unauthorized(res, "id is required");
        }


        const findUnit = await ModelUnit.findById(id)

        return ResAPi.Success(res, "Success", findUnit)
    } catch (error) {
        console.log(error)
    }

});

routes.put('/edit', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar semua user
    const data = req.body

    const findUnit = await ModelUnit.findByIdAndUpdate(data.id, {
        $set: {
            unit: data.unit,
            guidebook: data.guidebook,
            description: data.description,
        }
    })

    return ResAPi.Success(res, "Edit Success", findUnit)
});
routes.delete('/delete', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar semua user
    const id = req.query.id
    const category_id = req.query.category_id


    await ModelCategory.findByIdAndUpdate(category_id, { $inc: { unit: -1 } });
    await ModelUnit.findByIdAndDelete(id)
    await ModelQuestion.deleteMany({ unit_id: id })
    await ModelStage.deleteMany({ unit_id: id })


    return ResAPi.Success(res, "Delete Success")
});

// Rute untuk mengirimkan data tambah user
routes.post('/create', validateToken, validateAdmin, ValidateUnit, async (req, res) => {
    try {
        const data = req.body;
        // Create and save the new unit
        const findUnitByCategory = await ModelUnit.findOne({ category_id: data.category_id, unit: data.unit })

        if (findUnitByCategory) {
            return ResAPi.ErrorCreate(res, "Unit Sudah Pernah Dibuat.");
        }

        const newUnit = new ModelUnit(data);
        await newUnit.save();

        // Increment the unit count in the associated category
        await ModelCategory.findByIdAndUpdate(data.category_id, { $inc: { unit: 1 } });

        return ResAPi.SuccessCreate(res);
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return ResAPi.ErrorCreate(res, "Unit Sudah Pernah Dibuat."); // Duplicate key error
        }
        return ResAPi.ErrorCreate(res); // Other errors
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
