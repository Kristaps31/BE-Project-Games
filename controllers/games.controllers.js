const {selectCategories, selectReviews, selectCommentsByID} = require("../models/games.models")


exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch(err => {
    throw err
    })
};

exports.getReviews = (req, res, next) => {
    selectReviews()
    .then((reviews) => {
        reviews.forEach(review => review)
        res.status(200).send({reviews})
    })
    .catch(err => {
        throw err
    });
};

exports.getCommentsByID = (req, res, next) => {
    const { review_id } = req.params;
    selectCommentsByID(review_id)
    .then((comment) => {
        res.status(200).send({comment})
    })
    .catch(err => {
    throw err
    })
}