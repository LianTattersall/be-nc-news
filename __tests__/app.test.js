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
                expect(msg).toBe('400 - Bad Request Invalid Data Type')
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
    describe('PATCH' , () => {
        test('PATCH: 200 - returns the updated article object' , () => {
            const patchInfo = {inc_votes: 5}
            const expected = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 105,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              }
            return request(app)
            .patch('/api/articles/1')
            .send(patchInfo)
            .expect(200)
            .then(({body: {article}}) => {
                expect(article).toEqual(expected)
            })
        })
        test('PATCH: 200 - returns the updated article when inc_votes is negative' , () => {
            const patchInfo = {inc_votes: -5}
            const expected = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 95,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              }
            return request(app)
            .patch('/api/articles/1')
            .send(patchInfo)
            .expect(200)
            .then(({body: {article}}) => {
                expect(article).toEqual(expected)
            })
        })
        test('PATCH: 400 - Bad request returns an error when inc_votes is not a number' , () => {
            const patchInfo = {inc_votes: 'string'}
            return request(app)
            .patch('/api/articles/1')
            .send(patchInfo)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual('400 - Bad Request Invalid Data Type')
            })
        })
        test('PATCH: 404 - Not found returns an error when ther article id does not exist' , () => {
            const patchInfo = {inc_votes: 19}
            return request(app)
            .patch('/api/articles/100')
            .send(patchInfo)
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toEqual('404 - Article not found')
            })
        })
        test('PATCH: 400 - Bad request returns an error when the patch request body does not contain the correct key', () => {
            const patchInfo = {worng_key: 10}
            return request(app)
            .patch('/api/articles/1')
            .send(patchInfo)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual('400 - Bad Request Incorrect Format')
            })
        })
        test('PATCH: 400 - Bad request returns an error when the patch request body contains too many properties', () => {
            const patchInfo = {worng_key: 10 , inc_votes: 7}
            return request(app)
            .patch('/api/articles/1')
            .send(patchInfo)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual('400 - Bad Request Incorrect Format')
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
                expect(msg).toBe('400 - Bad Request Invalid Data Type')
            })
        })
        test('GET: 404 - not found when the article does not exist' , () => {
            return request(app)
            .get('/api/articles/2340/comments')
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('404 - No such article')
            })
        })
        test('GET: 200 - returns an empty array when the article exists but has no comments' , () => {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments).toEqual([])
            })
        })
        test('GET: 200 - returns an empty array when the article exists but has no comments' , () => {
            return request(app)
            .get('/api/articles/7/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments).toEqual([])
            })
        })
    })
    describe('POST' , () => {
        test('POST: 201 - returns the comment object the has just been posted' , () => {
            const postInfo = {username: 'butter_bridge' , body: 'Me too!'}
            return request(app)
            .post('/api/articles/1/comments')
            .send(postInfo)
            .expect(201)
            .then(({body: {comment}}) => {
                expect(comment).toEqual({
                    comment_id: 19,
                    votes: 0,
                    created_at: expect.any(String),
                    author: 'butter_bridge',
                    body: 'Me too!',
                    article_id: 1
                })
            })
        })
        test('POST: 404 - Not found returns an error when the username is not valid i.e not in the users table' , () => {
            const postInfo = {username: 'invalidUsername468' , body: 'hi'}
            return request(app)
            .post('/api/articles/2/comments')
            .send(postInfo)
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('404 - Not Found')
            })
        })
        test('POST: 404 - Not found returns an error when a user tries to comment on an article that does not exist' , () => {
            const postInfo = {username: 'butter_bridge' , body: 'omg'}
            return request(app)
            .post('/api/articles/725/comments')
            .send(postInfo)
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('404 - Not Found')
            })
        })
        test('POST: 400 - Bad request returns an error when the request body does not have the correct format' , () => {
            const postInfo = {wrongKey: 2}
            return request(app)
            .post('/api/articles/3/comments')
            .send(postInfo)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Bad Request Incorrect Format')
            })
        })
        test('POST: 400 - Bad request returns an error when a user tries to comment on an article id that is not a number' , () => {
            const postInfo = {username: 'butter_bridge' , body: 'omg'}
            return request(app)
            .post('/api/articles/hello/comments')
            .send(postInfo)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Bad Request Invalid Data Type')
            })
        })
        test('POST: 400 - Bad request returns an error when the request body has too many fields' , () => {
            const postInfo = {wrongKey: 2 , username: 'butter_bridge' , body: 'omg'}
            return request(app)
            .post('/api/articles/3/comments')
            .send(postInfo)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Bad Request Incorrect Format')
            })
        })
    })
})

describe('/api/comments/:comment_id' , () => {
    describe('DELETE' , () => {
        test('DELETE: 204 - responds with no body when the delete is successful' , () => {
            return request(app)
            .delete('/api/comments/2')
            .expect(204)
            .then(({body}) => {
                expect(body).toEqual({})
            })
        })
        test('DELETE: 400 - Bad request returns an error when the comment id is not a number' , () => {
            return request(app)
            .delete('/api/comments/numbertwo')
            .expect(400)
            .expect(({body: {msg}}) => {
                expect(msg).toBe('400 - Bad Request Invalid Data Type')
            })
        })
        test('DELETE: 404 Not found returns an error when the comment id does not exist' , () => {
            return request(app)
            .delete('/api/comments/9000')
            .expect(404)
            .expect(({body: {msg}}) => {
                expect(msg).toBe('404 - Comment not found')
            })
        })
    })
})

describe('/api/users' , () => {
    describe('GET' , () => {
        test('GET: 200 - responds with an array of user objects each with username, name, and avatar_url properties' , () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body: {users}}) => {
                expect(users.length).toBe(4)
                users.forEach((user) => {
                    expect(user).toEqual({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
        })
    })
})