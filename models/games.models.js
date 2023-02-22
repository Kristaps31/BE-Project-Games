const db = require('../db/connection')

exports.selectCategories = () => {
    return db.query("SELECT * FROM categories;").then(result => {
        const categories = result.rows
        return categories;
}
)};

exports.selectReviews = () => {
    return db.query(`
    SELECT 
    reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,  
    COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY 
    reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer
    ORDER BY created_at DESC;
    `)
    .then(result => {
        const reviews = result.rows
        return reviews;
  });
}

exports.selectCommentsByID = (id) => {
return db.query 
(`SELECT * FROM comments WHERE comment_id = $1;`, [id])
.then(results => {
    if(results.rowCount === 0) {
        return Promise.reject("No comment with such ID");
    }
    return results.rows[0];
})
}
