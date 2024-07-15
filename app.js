const express = require('express')
const { endpointNotFound, internalServerError } = require('./error-handling-functions')
const { getTopics } = require('./controllers/topics-controllers')
const { getEndpoints } = require('./controllers/endpoints-controllers')

const app = express()

app.get('/api' , getEndpoints)

app.get('/api/topics' , getTopics)

app.all('*' , endpointNotFound)

app.use(internalServerError)

module.exports = app