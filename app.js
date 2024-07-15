const express = require('express')
const { endpointNotFound, internalServerError, psqlError, customError } = require('./error-handling-functions')
const { getTopics } = require('./controllers/topics-controllers')
const { getEndpoints } = require('./controllers/endpoints-controllers')
const { getArticleById } = require('./controllers/articles-controllers')

const app = express()

app.get('/api' , getEndpoints)

app.get('/api/topics' , getTopics)

app.get('/api/articles/:article_id' , getArticleById)

app.all('*' , endpointNotFound)

app.use(psqlError)

app.use(customError)

app.use(internalServerError)

module.exports = app