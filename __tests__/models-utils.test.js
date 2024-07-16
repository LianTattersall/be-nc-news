const { checkArticleExists } = require("../model-utils.js")
const db = require('../db/connection.js')

afterAll(() => {
    return db.end()
})

describe('checkArticleExists' , () => {
    test('returns true when the article id does exist in the articles table' , () => {
        return checkArticleExists(2).then((result) => {
            expect(result).toBe(true)
        })
    })
    test('returns false when the article id does not exist' , () => {
        return checkArticleExists(999).then((result) => {
            expect(result).toBe(false)
        })
    })
    test('edge cases still returns false' , () => {
        return checkArticleExists(14).then((result) => {
            expect(result).toBe(false)
        })
    })
    test('edge cases still returns true' , () => {
        return checkArticleExists(13).then((result) => {
            expect(result).toBe(true)
        })
    })
})