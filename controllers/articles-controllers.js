const { fetchArticleById, fetchArticles, updateArticle, addArticle, removeArticleById } = require("../models/articles-models")

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
    const {sort_by , order , topic , limit , p} = request.query
    fetchArticles(sort_by , order , topic , limit , p)
    .then(([{rows} , totalCount]) => {
        response.status(200).send({articles: rows , total_count: totalCount})
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

exports.postArticle = (request , response , next) => {
    const {title , author , body , topic , article_img_url} = request.body
    addArticle(title , author , body , topic , article_img_url)
    .then(({rows}) => {
        response.status(201).send({article: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteArticleById = (request , response , next) => {
    const {article_id} = request.params
    removeArticleById(article_id)
    .then(() => {
        response.status(204).send({})
    })
    .catch((err) => {
        next(err)
    })
}