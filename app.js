const express = require("express");

const {getCategories, getReviews, getReviewsById, postCommentByReviewId} = require("./controllers/games.controllers")
const {handleCustomErrors, handle500Errors, handle400Errors, handle404Errors} = require ("./controllers/error.controllers")
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories)

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById)

app.post("/api/reviews/:review_id/comments", postCommentByReviewId)

app.use(handleCustomErrors);
app.use(handle400Errors);
app.use(handle404Errors);
app.use(handle500Errors);

module.exports = app; 

