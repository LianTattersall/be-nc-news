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
    fetchArticles()
    .then(({rows}) => {
        response.status(200).send({articles: rows})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticles = (request , response , next) => {
    const {article_id} = request.params
    const {inc_votes} = request.body
    updateArticle(article_id , inc_votes)
    .then(({rows}) => {
        if (Object.keys(request.body).length !== 1) {
            return Promise.reject({status: 400, msg: '400 - Bad Request Incorrect Format'})
        }
        response.status(200).send({article: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}