const {selectCategories, selectReviewsById} = require("../models/games.models")

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch(err => {
    throw err
})
};

exports.getReviewsById = (req, res, next) => {

    const { review_id } = req.params;

    selectReviewsById(review_id)
    .then((review) => {
        res.status(200).send({review})
    })
    .catch(err => {
        next (err);
    })
}