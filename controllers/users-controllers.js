const { fetchUsers } = require("../models/users-models")

exports.getUsers = (request , response , next) => {
    fetchUsers()
    .then(({rows}) => {
        response.status(200).send({users: rows})
    })
    .catch((err) => {
        next(err)
    })
}