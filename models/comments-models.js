const { checkArticleExists } = require('../model-utils.js')
const db = require('../db/connection.js')

exports.fetchCommentsByArticleId = (article_id) => {
    const commentsQuery = db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC` , [article_id])
    const articleExistsQuery = checkArticleExists(article_id)
    return Promise.all([commentsQuery , articleExistsQuery])
    .then(([commentsQuery , articleExists]) => {
        if (articleExists) {
            return commentsQuery
        } else {
            return Promise.reject({status: 404, msg: '404 - No such article'})
        }
    })
}

exports.addComment = (username , body , article_id) => {
    return db.query(`
    INSERT INTO comments (body , article_id , author) 
    VALUES ($1 , $2 , $3) RETURNING *` , [body , article_id , username])
}

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *` , [comment_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404 , msg: '404 - Comment not found'})
        }
    })
}

exports.updateComment = (comment_id , inc_votes) => {
    return db.query(`
    UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *` , [inc_votes , comment_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404 , msg: '404 - Comment not found'})
        }
        return {rows}
    })
}