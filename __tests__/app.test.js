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
        test('GET: 200 - returns with the specified article information from the specified id with comment_count property' , () => {
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
                comment_count: 11
              }
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body: {article}}) => {
                expect(article).toEqual(expected)
            })
        })
        test('GET: 200 - returns with the specified article information from the specified id with comment_count property' , () => {
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
                comment_count: 2
              }
            return request(app)
            .get('/api/articles/5')
            .expect(200)
            .then(({body: {article}}) => {
                expect(article).toEqual(expected)
            })
        })
        test('GET: 200 - responds with article info with comment count of zero if there are no comments' , () => {
            const expected = {
                article_id: 2,
                comment_count: 0,
                votes: 0,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                author: "icellusedkars",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                created_at: "2020-10-16T05:03:00.000Z",
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              }
            return request(app)
            .get('/api/articles/2')
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
        test('PATCH: 200 - responds with the updates article when there are additional keys', () => {
            const patchInfo = {worng_key: 10 , inc_votes: 7}
            const expected = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 107,
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
    })
})

describe('/api/articles' , () => {
    describe('GET' , () => {
        test('GET: 200 - returns with an array of articles objects without the body property' , () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(10)
                articles.forEach((article) => {
                    expect(article).toEqual({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
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
    describe('GET - queries' , () => {
        test('?sort_by=article_id - responds with the articles sorted by descending article_id' , () => {
            return request(app)
            .get('/api/articles?sort_by=article_id')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(10)
                expect(articles).toBeSortedBy('article_id' , {descending: true})
            })
        })
        test('?sort_by=title - responds with the articles sorted by descending title' , () => {
            return request(app)
            .get('/api/articles?sort_by=title')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(10)
                expect(articles).toBeSortedBy('title' , {descending: true})
            })
        })
        test('?sort_by=invalid-column - responds with an error (400) when the sort_by query is not a valid column' , () => {
            return request(app)
            .get('/api/articles?sort_by=not-a-column')
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Bad Request Invalid Column Name')
            })
        })
        test('?order=asc - responds with the articles sorted by ascending created_at' , () => {
            return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(10)
                expect(articles).toBeSortedBy('created_at' , {descending: false})
            })
        })
        test('?order=asc&sort_by=comment_count - the queries can be added together' , () => {
            return request(app)
            .get('/api/articles?sort_by=comment_count&order=asc')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(10)
                expect(articles).toBeSortedBy('comment_count' , {descending: false})
            })
        })
        test('?order=invalid_input - responds with an error if the order is not either asc or desc' , () => {
            return request(app)
            .get('/api/articles?order=wavy')
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Bad Request Invalid order_by Query')
            })
        })
        test('?topic=mitch - can add a query to filter by topic' , () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(10)
                articles.forEach((article) => {
                    expect(article).toEqual({
                        title: expect.any(String),
                        topic: 'mitch',
                        author: expect.any(String),
                        created_at: expect.any(String),
                        article_img_url: expect.any(String),
                        article_id: expect.any(Number),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                })
            })
        })
        test('?topics=paper - returns an empty array for topics that exist but do not have any articles' , () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles).toEqual([])
            })
        })
        test('?topic=invalid-topic - responds with a 404 error when the topic does not exist' , () => {
            return request(app)
            .get('/api/articles?topic=not-a-topic')
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('404 - Topic not found')
            })
        })
        test('?topic=mitch&sort_by=title&order=asc - can combine all three queries' , () => {
            return request(app)
            .get('/api/articles?topic=mitch&sort_by=title&order=asc')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(10)
                expect(articles).toBeSortedBy('title' , {descending: false})
                articles.forEach((article) => {
                    expect(article.topic).toBe('mitch')
                })

            })
        })
    })
    describe('POST' , () => {
        test('POST: 201 - responds with the posted article when the article has been added successfully to the db. With no article_img_url it defaults to the one in seed' , () => {
            const postInfo = {
                author: 'butter_bridge', 
                topic: 'cats',
                title: 'Riemann Hypothesis is Proved!', 
                body: 'Not really', 
                }
            return request(app)
            .post('/api/articles')
            .send(postInfo)
            .expect(201)
            .then(({body: {article}}) => {
                expect(article).toMatchObject({
                    article_id: 14,
                    topic: 'cats',
                    votes: 0,
                    author: 'butter_bridge', 
                    title: 'Riemann Hypothesis is Proved!', 
                    body: 'Not really', 
                    created_at: expect.any(String),
                    article_img_url: "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"})
            })
        })
        test('POST: 201 - responds with posted article when provided article_img_url with mathing urls' , () => {
            const postInfo = {
                author: 'butter_bridge', 
                topic: 'cats',
                title: 'Riemann Hypothesis is Proved!', 
                body: 'Not really', 
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                }
            return request(app)
            .post('/api/articles')
            .send(postInfo)
            .expect(201)
            .then(({body: {article}}) => {
                expect(article).toMatchObject({
                    article_id: 14,
                    author: 'butter_bridge', 
                    topic: 'cats',
                    title: 'Riemann Hypothesis is Proved!', 
                    body: 'Not really', 
                    created_at: expect.any(String),
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                    })
            })
        })
        test('POST: 404 - Not found responds with an error when the user does not exist' , () => {
            const postInfo = {
                author: 'Lian468', 
                topic: 'cats',
                title: 'Riemann Hypothesis is Proved!', 
                body: 'Not really', 
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                }
            return request(app)
            .post('/api/articles')
            .send(postInfo)
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('404 - Not Found. Foreign Key Violation.')
            })
        })
        test('POST: 404 - Not found responds with an error when the topic does not exist' , () => {
            const postInfo = {
                author: 'Lian468', 
                topic: 'Maths',
                title: 'Riemann Hypothesis is Proved!', 
                body: 'Not really', 
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                }
            return request(app)
            .post('/api/articles')
            .send(postInfo)
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('404 - Not Found. Foreign Key Violation.')
            })
        })
        test('POST: 400 - Bad request responds with an error when one of the fields is missing (apart from article_img_url' , () => {
            const postInfo = {
                author: 'butter_bridge', 
                topic: 'cats',
                body: 'Not really', 
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                }
            return request(app)
            .post('/api/articles')
            .send(postInfo)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Bad Request Incorrect Format')
            })
        })
        test('POST: 201 - responds successfully when there are additional fields' , () => {
            const postInfo = {
                author: 'butter_bridge', 
                topic: 'cats',
                title: 'Riemann Hypothesis is Proved!', 
                body: 'Not really',
                extraInfo: 'hello' 
                }
                return request(app)
                .post('/api/articles')
                .send(postInfo)
                .expect(201)
                .then(({body: {article}}) => {
                    expect(article).toMatchObject({
                        article_id: 14,
                        author: 'butter_bridge', 
                        topic: 'cats',
                        title: 'Riemann Hypothesis is Proved!', 
                        body: 'Not really', 
                        created_at: expect.any(String),
                        article_img_url: "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
                        })
                })
        })
    })
    describe('GET - pagination queries' , () => {
        test('GET: 200 - default limit is 10' , () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(10)
            })
        })
        test('GET: 200 - user can input limit and responds with specified number of articles' , () => {
            return request(app)
            .get('/api/articles?limit=5')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(5)
            })
        })
        test('GET: 400 - Bad request responds with an error when the limit is not a number' , () => {
            return request(app)
            .get('/api/articles?limit=hello')
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Limit not a number')
            })
        })
        test('GET: 200 - default page is one' , () => {
            return request(app)
            .get('/api/articles?sort_by=article_id&order=asc')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(10)
                articles.forEach((article , index) => {
                    expect(article.article_id).toBe(1 + index)
                })
            })
        })
        test('GET: 200 - responds with the correct page' , () => {
            return request(app)
            .get('/api/articles?sort_by=article_id&order=asc&p=2')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(3)
                articles.forEach((article , index) => {
                    expect(article.article_id).toBe(index + 11)
                })
            })
        })
        test('GET: 200 - responds empy array if page does not exist' , () => {
            return request(app)
            .get('/api/articles?sort_by=article_id&order=asc&p=3')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(0)
            })
        })
        test('GET: 400 - Bad request responds with an error when p is not a number' , () => {
            return request(app)
            .get('/api/articles?srto_by=article_id&order=asc&p=hello')
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Page not a number')
            })
        })
        test('GET: 200 - within response body there is a total count property with the total of any filters applied but disregards the limit' , () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {total_count}}) => {
                expect(total_count).toBe(13)
            })
        })
        test('GET: 200 - total_count is responsive to topic filters' , () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({body: {total_count}}) => {
                expect(total_count).toBe(0)
            })
        })
    })
})

describe('/api/articles/:article_id/comments' , () => {
    describe('GET' , () => {
        test('GET: 200 - returns with an array of comment objects relating to the specified article_id' , () => {
            return request(app)
            .get('/api/articles/1/comments?limit=11')
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
                expect(msg).toBe('404 - Not Found. Foreign Key Violation.')
            })
        })
        test('POST: 404 - Not found returns an error when a user tries to comment on an article that does not exist' , () => {
            const postInfo = {username: 'butter_bridge' , body: 'omg'}
            return request(app)
            .post('/api/articles/725/comments')
            .send(postInfo)
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('404 - Not Found. Foreign Key Violation.')
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
        test('POST: 200 - responds with the posted object when there are additional fields' , () => {
            const postInfo = {wrongKey: 2 , username: 'butter_bridge' , body: 'omg'}
            const expected = {
                comment_id: 19,
                votes: 0,
                created_at: expect.any(String),
                author: 'butter_bridge',
                body: 'omg',
                article_id: 3
            }
            return request(app)
            .post('/api/articles/3/comments')
            .send(postInfo)
            .expect(201)
            .then(({body: {comment}}) => {
                expect(comment).toEqual(expected)
            })
        })
    })
    describe('GET - pagination queries' , () => {
        test('GET: 200 - the default limit is 10' , () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments.length).toBe(10)
            })
        })
        test('GET: 200 - the can input a limit' , () => {
            return request(app)
            .get('/api/articles/1/comments?limit=2')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments.length).toBe(2)
            })
        })
        test('GET: 400 - Bad request when the limit is not a number' , () => {
            return request(app)
            .get('/api/articles/1/comments?limit=hello')
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Limit is not a number')
            })
        })
        test('GET: 200 - default page is 1' , () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments[0].comment_id).toBe(5)
            })
        })
        test('GET: 200 - user can input page and server responds with the correct article offset by the page number' , () => {
            return request(app)
            .get('/api/articles/1/comments?p=2&limit=4')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments[0].comment_id).toBe(7)
            })
        })
        test('GET: 400 - Bad request responds with an error when the page is not a number' , () => {
            return request(app)
            .get('/api/articles/1/comments?p=hell0')
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Page is not a number')
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
    describe('PATCH' , () => {
        test('PATCH: 200 - responds with the updated comment when the votes have been successfully modified' , () => {
            const patchInfo = {inc_votes: 5}
            const expected = {
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                votes: 21,
                author: "butter_bridge",
                article_id: 9,
                created_at: '2020-04-06T12:17:00.000Z',
              }
            return request(app)
            .patch('/api/comments/1')
            .send(patchInfo)
            .expect(200)
            .then(({body: {comment}}) => {
                expect(comment).toMatchObject(expected)
            })
        })
        test('PATCH: 400 - Bad Request responds with an error when the inc_votes is not a number' , () => {
            const patchInfo = {inc_votes: 'hi'}
            return request(app)
            .patch('/api/comments/1')
            .send(patchInfo)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Bad Request Invalid Data Type')
            })
        })
        test('PATCH: 400 - Bad Request responds with an error when the request body does not have a key of inc_votes' , () => {
            const patchInfo = {key: 3}
            return request(app)
            .patch('/api/comments/2')
            .send(patchInfo)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('400 - Bad Request Incorrect Format')
            })
        })
        test('PATCH: 404 - Not Found responds with an error when the comment id does not exist' , () => {
            const patchInfo = {inc_votes: 34}
            return request(app)
            .patch('/api/comments/2000')
            .send(patchInfo)
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('404 - Comment not found')
            })
        })
        test('PATCH: 200 - responds with the updated comment when there are additional properties to the request body' , () => {
            const patchInfo = {inc_votes: -1 , key: 345}
            const expected = {
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                votes: 15,
                author: "butter_bridge",
                article_id: 9,
                created_at: '2020-04-06T12:17:00.000Z',
              }
            return request(app)
            .patch('/api/comments/1')
            .send(patchInfo)
            .expect(200)
            .then(({body: {comment}}) => {
                expect(comment).toMatchObject(expected)
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

describe('/api/users/:username' , () => {
    describe('GET' , () => {
        test('GET: 200 - responds with a user object of the specified username' , () => {
            const expected = {
                username: 'lurker',
                name: 'do_nothing',
                avatar_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
              }
            return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({body: {user}}) => {
                expect(user).toMatchObject(expected)
            })
        })
        test('GET: 404 - responds with an error when the username does not exist' , () => {
            return request(app)
            .get('/api/users/22')
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('404 - User not found')
            })
        })
    })
})

