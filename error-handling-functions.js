exports.endpointNotFound = (request , response) => {
    response.status(404).send({msg: '404 - Endpoint not found'})
}

exports.internalServerError = ((err , request , response , next) => {
    response.status(500).send({msg: 'Internal Server Error'})
})

exports.psqlError = ((err , request , response , next) => {
    if (err.code === '22P02') {
        response.status(400).send({msg: '400 - Bad Request Invalid Data Type'})
    } else if (err.code === '23502') {
        response.status(400).send({msg: '400 - Bad Request Incorrect Format'})
    } else if (err.code === '23503') {
        response.status(404).send({msg: '404 - Not Found'})
    }
    next(err)
})

exports.customError = (err , request , response , next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({msg: err.msg})
    }
    next(err)
}