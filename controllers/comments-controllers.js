const { fetchCommentsByArticleId, addComment, removeComment, updateComment } = require("../models/comments-models")

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
        response.status(201).send({comment: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteComment = (request , response , next) => {
    const {comment_id} = request.params
    removeComment(comment_id)
    .then(() => {
        response.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchComment = (request , response , next) => {
    const {inc_votes} = request.body
    const {comment_id} = request.params
    updateComment(comment_id , inc_votes)
    .then(({rows}) => {
        response.status(200).send({comment: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}