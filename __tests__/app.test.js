const app = require('../app.js')

const request = require('supertest')
require('jest-sorted')

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
            const expected = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              }
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body: {article}}) => {
                expect(article).toEqual(expected)
            })
        })
        test('GET: 200 - returns with the specified article information from the specified id' , () => {
            const expected = {
                article_id: 5,
                title: "UNCOVERED: catspiracy to bring down democracy",
                topic: "cats",
                author: "rogersop",
                body: "Bastet walks amongst us, and the cats are taking arms!",
                created_at: "2020-08-03T13:14:00.000Z",
                votes: 0,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              }
            return request(app)
            .get('/api/articles/5')
            .expect(200)
            .then(({body: {article}}) => {
                expect(article).toEqual(expected)
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

describe('/api/articles' , () => {
    describe('GET' , () => {
        test('GET: 200 - returns with an array of articles objects without the body property' , () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(13)
                articles.forEach((article) => {
                    expect(article).toEqual({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comments_count: expect.any(Number)
                    })
                })
            })
        })
        test('GET: 200 - the return array contains article objects sorted into date order (descending)' , () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles).toBeSortedBy('created_at' , {descending: true})
            })
        })
    })
})

describe('/api/articles/:article_id/comments' , () => {
    describe('GET' , () => {
        test('GET: 200 - returns with an array of comment objects relating to the specified article_id' , () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments.length).toBe(11)
                comments.forEach((comment) => {
                    expect(comment).toEqual({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: 1
                    })
                })
            })
        })
        test('GET: 200 - the returned array sorts the comments by date (descending' , () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments).toBeSortedBy('created_at' , {descending: true})
            })
        })
        test('GET: 400 - Bad request returns an error when the article id is not a number' , () => {
            return request(app)
            .get('/api/articles/23hello/comments')
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Bad Request')
            })
        })
        test('GET: 404 - not found when there are no corresponding comments' , () => {
            return request(app)
            .get('/api/articles/2340/comments')
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('404 - No comments found')
            })
        })
    })
})