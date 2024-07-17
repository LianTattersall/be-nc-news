const db = require('../db/connection.js')
const { checkTopicExists } = require('../model-utils.js')

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1` , [article_id])
}

exports.fetchArticles = (sort_by = 'created_at' , order = 'desc' , topic) => {
    let queryStr = `
    SELECT articles.article_id , articles.title , articles.author , articles.topic , articles.votes , articles.article_img_url , articles.created_at , 
    CAST(COUNT(comment_id) AS INT) AS comment_count FROM articles 
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id
    `
    const queryArr = []

    const queryValues = []
    if (topic) {
        queryStr += ` WHERE articles.topic = $1` 
        queryValues.push(topic)
        queryArr.push(checkTopicExists(topic))
    }
    queryStr += ` GROUP BY articles.article_id , articles.title , articles.author , articles.topic , articles.votes , articles.article_img_url , articles.created_at`
    
    const validColumns = ['article_id' , 'title' , 'topic' , 'author' , 'created_at' , 'votes' , 'article_img_url' , 'comment_count']
    if (!validColumns.includes(sort_by)) {
        return Promise.reject({status: 400 , msg: '400 - Bad Request Invalid Column Name'})
    }

    const validOrder = ['asc' , 'desc']
    if (!validOrder.includes(order)) {
        return Promise.reject({status: 400 , msg: '400 - Bad Request Invalid order_by Query'})
    }
    queryStr += ` ORDER BY ${sort_by} ${order}`

    const articlesQuery = db.query(queryStr , queryValues)
    queryArr.unshift(articlesQuery)
    
    return Promise.all(queryArr)
    .then(([{rows} , topicExists]) => {
        if (rows.length === 0 && !topicExists) {
            return Promise.reject({status: 404 , msg: '404 - Topic not found'})
        }
        return {rows}
    })
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