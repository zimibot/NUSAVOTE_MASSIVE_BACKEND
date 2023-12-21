const express = require('express');
const routes = express.Router();
const ResAPi = require("../../middleware/CodeResponse");
const validateToken = require('../../middleware/ValidateToken');
const ModelUser = require('../../model/Database/ModelUser');
const validateAdmin = require('../../middleware/validateAdmin')

// Rute utama /users
routes.get('/', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar user dengan pagination
    try {
        const page = parseInt(req.query.page) || 1; // default to page 1
        const limit = parseInt(req.query.limit) || 10; // default limit to 10 items per page
        const skipIndex = (page - 1) * limit;

        const items = await ModelUser.find()
            .sort({ _id: 1 })
            .limit(limit)
            .skip(skipIndex);

        return ResAPi.Success(res, "Success", items);

    } catch (error) {
        return ResAPi.Unauthorized();
    }
});
routes.get('/:id', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar user dengan pagination
    try {
        const id = req.params.id
        const items = await ModelUser.findById(id)
        return ResAPi.Success(res, "Success", items);

    } catch (error) {
        return ResAPi.Unauthorized();
    }
});
routes.get('/', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar user dengan pagination
    try {
        const page = parseInt(req.query.page) || 1; // default to page 1
        const limit = parseInt(req.query.limit) || 10; // default limit to 10 items per page
        const skipIndex = (page - 1) * limit;

        const items = await ModelUser.find()
            .sort({ _id: 1 })
            .limit(limit)
            .skip(skipIndex);

        return ResAPi.Success(res, "Success", items);

    } catch (error) {
        return ResAPi.Unauthorized();
    }
});
routes.delete('/:id/delete', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar user dengan pagination
    try {
        const id = req.params.id
        await ModelUser.findByIdAndDelete(id)
        return ResAPi.Success(res, "Success Delete");

    } catch (error) {
        return ResAPi.Unauthorized();
    }
});

routes.put('/:id/edit', validateToken, validateAdmin, async (req, res) => {
    // Menampilkan daftar user dengan pagination
    try {
        const id = req.params.id
        const data = req.body

        const hashedPassword = await argon2.hash(data.password);

        await ModelUser.findByIdAndUpdate(id, {
            $set: {
                ...data,
                password: hashedPassword
            }
        })
        return ResAPi.Success(res, "Success Edit");

    } catch (error) {
        return ResAPi.Unauthorized();
    }
});

module.exports = routes;
