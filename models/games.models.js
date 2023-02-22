const db = require('../db/connection')

exports.selectCategories = () => {
    return db.query("SELECT * FROM categories;").then(result => {
        const categories = result.rows
        return categories;
}
)};

exports.selectReviewsById = (id) => {
    let queryString = "SELECT * FROM reviews"
    const queryParams = [];

    if(review_id !== undefined){
        queryString += "WHERE review_id = $1"
        queryParams.push(review_id)
    }

    return db.query(queryString, queryParams).then(results => {
        const rowCount = result.rowCount
        if(rowCount === 0) {
            return Promise.reject("No review with such ID");
        }
        return results.rows[0];
    })
}
