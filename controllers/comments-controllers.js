const { fetchCommentsByArticleId, addComment } = require("../models/comments-models")

exports.getCommentsByArticleId = (request , response , next) => {
    const {article_id} = request.params
    fetchCommentsByArticleId(article_id)
    .then(({rows}) => {
        response.status(200).send({comments: rows})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postComment = (request , response , next) => {
    const {username , body} = request.body
    const {article_id} = request.params
    addComment(username , body , article_id)
    .then(({rows}) => {
        if (Object.keys(request.body).length !== 2) {
            return Promise.reject({status: 400, msg: '400 - Bad Request Incorrect Format'})
        }
        response.status(201).send({comment: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}