const db = require('./db/connection.js')

exports.checkArticleExists = (artilce_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1` , [artilce_id])
    .then(({rows}) => {
        return rows.length !== 0
    })
}

exports.checkTopicExists = (topic) => {
    return db.query(`SELECT * FROM topics WHERE topics.slug = $1` , [topic])
    .then(({rows}) => {
        return rows.length !== 0
    })
}