const app = require('../app.js')

const request = require('supertest')

const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')

const db = require('../db/connection.js')

const endpointsObj = require('../endpoints.json')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe('404 - endpoint not found' , () => {
    test('404 - returns a 404 error when an invalid endpoint is entered' , () => {
        return request(app)
        .get('/not-an-endpoint')
        .expect(404)
        .then(({body: {msg}}) => {
            expect(msg).toBe('404 - Endpoint not found')
        })
    })
})

describe('/api/topics' , () => {
    describe('GET' , () => {
        test('GET: 200 - returns with an array of topic objects each containing a slug and description' , () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body: {topics}}) => {
                expect(topics.length).toBe(3)
                topics.forEach((topic) => {
                    expect(typeof topic.slug).toBe('string')
                    expect(typeof topic.description).toBe('string')
                })
            })
        })
    })
})

describe('/api' , () => {
    describe('GET' , () => {
        test('GET: 200 - returns with an object containing information on all the endpoints' , () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body: {endpoints}}) => {
                console.log(endpoints)
                expect(endpoints).toEqual(endpointsObj)
            })
        })
    })
})