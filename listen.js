const app = require('./app.js')

const { PORT = 9090 } = process.env;

app.listen(PORT , () => {
        return console.log('listening on port 9090')
    }
)