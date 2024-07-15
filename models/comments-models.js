const db = require('../db/connection.js')

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC` , [article_id])
}