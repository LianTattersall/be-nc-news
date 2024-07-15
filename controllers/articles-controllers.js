const { fetchArticleById, fetchArticles } = require("../models/articles-models")

exports.getArticleById = (request , response , next) => {
    const {article_id} = request.params
    fetchArticleById(article_id)
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: '404 - Article not found'})
        }
        const article = rows[0]
        response.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (request , response , next) => {
    fetchArticles()
    .then(({rows}) => {
        response.status(200).send({articles: rows})
    })
    .catch((err) => {
        next(err)
    })
}