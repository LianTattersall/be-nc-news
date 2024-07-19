const { request, response } = require("../app")
const { fetchTopics, addTopic } = require("../models/topics-models")

exports.getTopics = (request , response , next) => {
    fetchTopics()
    .then(({rows}) => {
        response.status(200).send({topics: rows})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postTopic = (request , response , next) => {
    const {slug , description} = request.body
    addTopic(slug , description)
    .then(({rows}) => {
        response.status(201).send({topic: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}