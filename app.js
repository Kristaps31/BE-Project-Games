const express = require("express");
const {getCategories, getReviews, getCommentsByID} = require("./controllers/games.controllers")
const {handle404Errors} =require(`./controllers/error.controllers`)
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByID)

app.use(handle404Errors);

module.exports = app; 



