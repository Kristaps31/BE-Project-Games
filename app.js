const express = require("express");
const {getCategories, getReviewsById} = require("./controllers/games.controllers")
const {handleCustomErrors} = require ("./controllers/error.controllers")
const app = express();

app.get("/api/categories", getCategories)

app.get("/api/reviews/:review_id", getReviewsById)

module.exports = app; 

app.use(handleCustomErrors);