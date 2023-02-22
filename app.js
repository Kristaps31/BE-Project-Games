const express = require("express");
const {getCategories, getReviewsById} = require("./controllers/games.controllers")
const {handleCustomErrors, handle500Errors, handle400Errors, handle404Errors} = require ("./controllers/error.controllers")
const app = express();

app.get("/api/categories", getCategories)

app.get("/api/reviews/:review_id", getReviewsById)

module.exports = app; 

app.use(handleCustomErrors);
app.use(handle400Errors);
app.use(handle404Errors);
app.use(handle500Errors);