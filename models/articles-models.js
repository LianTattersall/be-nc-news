const db = require('../db/connection.js')
const { checkTopicExists } = require('../model-utils.js')

exports.fetchArticleById = (article_id) => {
    return db.query(`
    SELECT articles.article_id ,article_img_url, articles.author, articles.body, articles.created_at, articles.title, articles.topic, articles.votes, CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM articles LEFT JOIN comments 
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id , article_img_url , articles.author, articles.body , articles.created_at, articles.title, articles.topic, articles.votes` , [article_id])
}

exports.fetchArticles = (sort_by = 'created_at' , order = 'desc' , topic , limit = 10 , p = 1) => {
    let queryStr = `
    SELECT articles.article_id , articles.title , articles.author , articles.topic , articles.votes , articles.article_img_url , articles.created_at , 
    CAST(COUNT(comment_id) AS INT) AS comment_count FROM articles 
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id
    `
    let totalQueryStr = `SELECT CAST(COUNT(article_id) AS INT) FROM articles`
    const queryArr = []

    const queryValues = []
    if (topic) {
        queryStr += ` WHERE articles.topic = $1` 
        totalQueryStr += ` WHERE articles.topic = $1` 
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

    if (!Number(limit)) {
        return Promise.reject({status: 400 , msg: '400 - Limit not a number'})
    }
    
    if (!Number(p)) {
        return Promise.reject({status: 400 , msg: '400 - Page not a number'})
    }

    queryStr += ` LIMIT ${limit} OFFSET ${(p - 1) * limit}`

    const articlesQuery = db.query(queryStr , queryValues)
    const totalCountQuery = db.query(totalQueryStr , queryValues)
    queryArr.unshift(articlesQuery , totalCountQuery)
    
    return Promise.all(queryArr)
    .then(([{rows} ,totalCountQuery, topicExists]) => {
        const totalCount = totalCountQuery.rows[0].count
        if (rows.length === 0 && !topicExists && topic) {
            return Promise.reject({status: 404 , msg: '404 - Topic not found'})
        }
        return [{rows} , totalCount]
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

exports.addArticle = (title , author , body , topic , article_img_url) => {
    article_img_url = article_img_url || 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
    return db.query(`
    INSERT INTO articles (title , author , body , topic , article_img_url) 
    VALUES ($1, $2 , $3 , $4 , $5) RETURNING *` , [title , author , body , topic , article_img_url])
}

exports.removeArticleById = (article_id) => {
    return db.query(`DELETE FROM articles WHERE article_id = $1 RETURNING *` , [article_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404 , msg: '404 - Article not found'})
        }
    })
}