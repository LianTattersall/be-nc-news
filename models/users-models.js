const db = require('../db/connection.js')

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
}

exports.fetchUserByUsername = (username) => {
    return db.query(`
    SELECT * FROM users WHERE username = $1` , [username])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404 , msg: '404 - User not found'})
        }
        return {rows}
    })
}