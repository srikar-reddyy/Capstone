const exp = require('express');
const userApp = exp.Router();
const userAuthor = require('../MODELS/userAuthorModel');
const createUserOrAuthor = require('../createUserOrAuthor');
const expressAsyncHandler = require("express-async-handler");
const Article = require('../MODELS/articleModel');

// Create User or Author
userApp.post("/user", expressAsyncHandler(createUserOrAuthor));

// Add a Comment to an Article
userApp.put("/comment/:articleId", expressAsyncHandler(async (req, res) => {
    const commentObj = req.body;

    const updatedArticle = await Article.findOneAndUpdate(
        { articleId: req.params.articleId },
        { $push: { comments: commentObj } },
        { returnOriginal: false }
    );

    res.status(200).send({ message: "Comment Added", payload: updatedArticle });
}));

// Get Comments for an Article
userApp.get("/comments/:articleId", expressAsyncHandler(async (req, res) => {
    const article = await Article.findOne({ articleId: req.params.articleId });

    if (!article) {
        return res.status(404).send({ message: "Article Not Found" });
    }

    res.status(200).send({ message: "CommentsRetrieved", comments: article.comments });
}));

module.exports = userApp;
