const express = require('express')
const { endpointNotFound, internalServerError, psqlError, customError } = require('./error-handling-functions')

const apiRouter = require('./routers/api-router')

const app = express()

app.use(express.json())

app.use('/api', apiRouter)

app.all('*' , endpointNotFound)

app.use(psqlError)

app.use(customError)

app.use(internalServerError)

module.exports = app