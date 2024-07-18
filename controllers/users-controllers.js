const { fetchUsers, fetchUserByUsername } = require("../models/users-models")

exports.getUsers = (request , response , next) => {
    fetchUsers()
    .then(({rows}) => {
        response.status(200).send({users: rows})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUserByUsername = (request , response , next) => {
    const {username} = request.params
    fetchUserByUsername(username)
    .then(({rows}) => {
        response.status(200).send({user: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}