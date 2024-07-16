const app = require('./app.js')

app.listen(9000 , (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('listening on port 9000')
    }
})