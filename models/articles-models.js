const db = require('../db/connection.js')

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1` , [article_id])
}

exports.fetchArticles = () => {
    return db.query(`
    SELECT articles.article_id , articles.title , articles.author , articles.topic , articles.votes , articles.article_img_url , articles.created_at , COUNT(comment_id) AS comments_count FROM articles 
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id , articles.title , articles.author , articles.topic , articles.votes , articles.article_img_url , articles.created_at
    ORDER BY created_at DESC`)
    .then(({rows}) => {
        const articles = rows.map((article) => {
            const articleCopy = {...article}
            articleCopy.comments_count = Number(article.comments_count)
            return articleCopy
        })
        return articles
    })
}