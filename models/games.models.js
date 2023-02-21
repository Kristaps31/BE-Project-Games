const db = require('../db/connection')

exports.selectCategories = () => {
    return db.query("SELECT * FROM categories;").then(result => {
        const categories = result.rows
        return categories;
}
)};

exports.selectReviews = () => {
    return db.query("SELECT * FROM reviews ORDER BY review_id").then(results => {
        const reviews = results.rows;
        return reviews;
    })
}