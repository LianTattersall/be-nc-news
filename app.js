const express = require('express')
const { endpointNotFound, internalServerError, psqlError, customError } = require('./error-handling-functions')
const { getTopics } = require('./controllers/topics-controllers')
const { getEndpoints } = require('./controllers/endpoints-controllers')
const { getArticleById, getArticles, patchArticle } = require('./controllers/articles-controllers')
const { getCommentsByArticleId, postComment } = require('./controllers/comments-controllers')

const app = express()

app.use(express.json())

app.get('/api' , getEndpoints)

app.get('/api/topics' , getTopics)

app.get('/api/articles/:article_id' , getArticleById)

app.get('/api/articles' , getArticles)

app.get('/api/articles/:article_id/comments' , getCommentsByArticleId)

app.post('/api/articles/:article_id/comments' , postComment)

app.patch('/api/articles/:article_id' , patchArticle)

app.all('*' , endpointNotFound)

app.use(psqlError)

app.use(customError)

app.use(internalServerError)

module.exports = app