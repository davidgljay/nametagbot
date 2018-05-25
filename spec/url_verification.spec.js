const url_verification = require('../events/url_verification')

describe('url_verification', () => {
  it('should return a challenge', () => {
    let result = {}
    const res = {
      json: (obj) => { result = obj }
    }
    const req = {
      body: {
        challenge: 'testtest'
      }
    }

    url_verification(req, res)
    expect(result.challenge).toEqual('testtest')
  })
})
