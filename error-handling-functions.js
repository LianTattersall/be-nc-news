exports.endpointNotFound = (request , response) => {
    response.status(404).send({msg: '404 - Endpoint not found'})
}

exports.internalServerError = ((err , request , response , next) => {
    response.status(500).send({msg: 'Internal Server Error'})
})