const db = require('../db/connection.js')

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
}

exports.addTopic = (slug , description) => {
    return db.query(`INSERT INTO topics (slug , description) VALUES ($1 , $2) RETURNING *` , [slug ,description])
}