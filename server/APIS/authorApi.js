const exp = require('express')
const authorApp = exp.Router()
const userAuthor = require('../MODELS/userAuthorModel')
const createUserOrAuthor = require('../createUserOrAuthor');
const expressAsyncHandler = require("express-async-handler");
const Article = require('../MODELS/articleModel');
const {requireAuth} = require('@clerk/express')
require('dotenv').config()

// create author
authorApp.post("/author",expressAsyncHandler(createUserOrAuthor));

// create article
authorApp.post("/article",expressAsyncHandler(async(req,res)=>{
    const newArticleObj = req.body;
    const newArticle = new Article(newArticleObj);
    const articleObj = await newArticle.save();
    res.status(201).send({message:"article published",payload:newArticle})
}))

// read all articles
authorApp.get("/articles",requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    const listOfArticles = await Article.find({isArticleActive:true});
    res.status(200).send({message:"articles",payload:listOfArticles})
}))

authorApp.get("/article/:articleId", requireAuth({signInUrl:"unauthorized"}), expressAsyncHandler(async(req, res) => {
    const articleId = req.params.articleId;
    const article = await Article.findOne({articleId: articleId});
    
    if (!article) {
        return res.status(404).send({message: "Article not found"});
    }
    
    res.status(200).send({message: "article", payload: article});
}));

authorApp.get("/unauthorized",(req,res)=>{
    res.send({message:"unauthorized request... plz login"})
})

authorApp.put("/unauthorized",(req,res)=>{
    res.send({message:"unauthorized request... plz login"})
})

// update article
authorApp.put('/article/:articleId', requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async (req, res) => {

    //get modified article
    const modifiedArticle = req.body;
    //update article by article id
    const latestArticle = await Article.findByIdAndUpdate(modifiedArticle._id,
        { ...modifiedArticle },
        { returnOriginal: false })
    //send res
    res.status(200).send({ message: "article modified", payload: latestArticle })
}))

//delete(soft delete) an article by article id
authorApp.put('/articles/:articleId',expressAsyncHandler(async (req, res) => {

    //get modified article
    const modifiedArticle = req.body;
    //update article by article id
    const latestArticle = await Article.findByIdAndUpdate(modifiedArticle._id,
        { ...modifiedArticle },
        { returnOriginal: false })
    //send res
    res.status(200).send({ message: "article deleted or restored", payload: latestArticle })
}))
// authorApp.get
module.exports = authorApp;