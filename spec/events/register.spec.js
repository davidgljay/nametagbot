
const register = require('../../events/register')
const team = require('../../models/team')
const slackapi = require('../../slackapi')
jest.mock('../../models/team')
jest.mock('../../slackapi')

describe('register', () => {
  let req

  beforeEach (() => {
    req = {
      query: {
        code: '1234'
      }
    }
    slackapi.oauth.access.mockResolvedValue({
      body: {
        team_id: '12345'
      }
    })
    team.create.mockReturnValue(Promise.resolve())
  })

  it('should save to the the database', () => {
    register(req)
      .then(() => {
        expect(team.create.mock.calls[0][0]).toEqual({team_id: '12345', id: '12345', token: 'abcd'})        
      })
  })
})
