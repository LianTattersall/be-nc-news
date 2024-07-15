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
                expect(endpoints).toEqual(endpointsObj)
            })
        })
    })
})

describe('/api/articles/:article_id' , () => {
    describe('GET' , () => {
        test('GET: 200 - returns with the specified article information from the specified id' , () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body: {article}}) => {
                expect(article.author).toBe("butter_bridge")
                expect(article.title).toBe("Living in the shadow of a great man")
                expect(article.article_id).toBe(1)
                expect(article.body).toBe("I find this existence challenging")
                expect(article.topic).toBe("mitch")
                expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
                expect(article.votes).toBe(100)
                expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
            })
        })
        test('GET: 200 - returns with the specified article information from the specified id' , () => {
            return request(app)
            .get('/api/articles/5')
            .expect(200)
            .then(({body: {article}}) => {
                expect(article.author).toBe("rogersop")
                expect(article.title).toBe("UNCOVERED: catspiracy to bring down democracy")
                expect(article.article_id).toBe(5)
                expect(article.body).toBe("Bastet walks amongst us, and the cats are taking arms!")
                expect(article.topic).toBe("cats")
                expect(article.created_at).toBe("2020-08-03T13:14:00.000Z")
                expect(article.votes).toBe(0)
                expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
            })
        })
        test('GET: 400 - returns an error when the article_id is not a number' , () => {
            return request(app)
            .get('/api/articles/not-a-number23')
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Bad Request')
            })
        })
        test('GET: 404 - returns an error when the article with specified id does not exist' , () => {
            return request(app)
            .get('/api/articles/5000')
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('404 - Article not found')
            })
        })
    })
})