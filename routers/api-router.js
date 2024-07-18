const { getEndpoints } = require("../controllers/endpoints-controllers");
const articlesRouter = require("./articles-routers");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const apiRouter = require("express").Router();

apiRouter.use('/topics' , topicsRouter)

apiRouter.use('/articles' , articlesRouter)

apiRouter.use('/comments' , commentsRouter)

apiRouter.use('/users' , usersRouter)

apiRouter.get('/', getEndpoints)

module.exports = apiRouter