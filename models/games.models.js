const db = require('../db/connection')

exports.selectCategories = () => {
    return db.query("SELECT * FROM categories;").then(result => {
        const categories = result.rows
        return categories;
}
)};

exports.selectReviewsById = (id) => {
    return db.query("SELECT * FROM reviews WHERE review_id = $1", [id])
    .then(results => {
        if(results.rowCount === 0) {
            return Promise.reject("No review with such ID");
        }
        return results.rows[0];
    })
}