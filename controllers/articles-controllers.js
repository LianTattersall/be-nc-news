const { fetchArticleById, fetchArticles, updateArticle } = require("../models/articles-models")

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
    const {sort_by , order , topic} = request.query
    fetchArticles(sort_by , order , topic)
    .then(({rows}) => {
        response.status(200).send({articles: rows})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticle = (request , response , next) => {
    const {article_id} = request.params
    const {inc_votes} = request.body
    updateArticle(article_id , inc_votes)
    .then(({rows}) => {
        response.status(200).send({article: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}