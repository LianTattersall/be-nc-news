const db = require('../db/connection.js')

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1` , [article_id])
}

exports.fetchArticles = () => {
    return db.query(`
    SELECT articles.article_id , articles.title , articles.author , articles.topic , articles.votes , articles.article_img_url , articles.created_at , CAST(COUNT(comment_id) AS INT) AS comments_count FROM articles 
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id , articles.title , articles.author , articles.topic , articles.votes , articles.article_img_url , articles.created_at
    ORDER BY created_at DESC`)
}

exports.updateArticle = (article_id , inc_votes) => {
    return db.query(`
    UPDATE articles 
    SET votes = votes + $1
    WHERE article_id = $2 RETURNING *` , [inc_votes , article_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: '404 - Article not found'})
        } else {
            return {rows}
        }
    })
}