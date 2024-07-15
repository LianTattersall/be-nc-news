const { fetchCommentsByArticleId } = require("../models/comments-models")

exports.getCommentsByArticleId = (request , response , next) => {
    const {article_id} = request.params
    fetchCommentsByArticleId(article_id)
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404 , msg: '404 - No comments found'})
        }
        response.status(200).send({comments: rows})
    })
    .catch((err) => {
        next(err)
    })
}