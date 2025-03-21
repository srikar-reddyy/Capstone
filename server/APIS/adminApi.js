const exp = require('express');
const adminApp = exp.Router();
const userAuthor = require('../MODELS/userAuthorModel');
const createUserOrAuthor = require('../createUserOrAuthor');
const expressAsyncHandler = require("express-async-handler");
const { requireAuth } = require('@clerk/express');
require('dotenv').config();

adminApp.post("/admin", expressAsyncHandler(createUserOrAuthor));

adminApp.get("/users",expressAsyncHandler(async (req, res) => {
    const users = await userAuthor.find({});
    res.status(200).send({ message: "Users fetched", payload: users});
}));

adminApp.put("/users/:userId/delete", expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const updatedUser = await userAuthor.findByIdAndUpdate(userId, { isActive:false}, { returnOriginal: false });

    if (!updatedUser) {
        return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User deleted", payload: updatedUser });
}));

adminApp.put("/users/:userId/restore",expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const restoredUser = await userAuthor.findByIdAndUpdate(userId, { isActive: true }, { returnOriginal: false });

    if (!restoredUser) {
        return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User restored", payload: restoredUser });
}));

adminApp.get("/unauthorized", (req, res) => {
    res.send({ message: "Unauthorized request... Please login" });
});

adminApp.put("/unauthorized", (req, res) => {
    res.send({ message: "Unauthorized request... Please login" });
});

module.exports = adminApp;