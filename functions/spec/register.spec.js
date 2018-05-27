
const register = require('../events/register')
const team = require('../models/team')
const slackapi = require('../slackapi')
jest.mock('../models/team')
jest.mock('../slackapi')

describe('register', () => {
  let req

  beforeEach (() => {
    req = {
      body: {
        team_id: '12345',
        token: 'abcd'
      }
    }

    team.create.mockReturnValue(Promise.resolve())
  })

  it('should save to the the database', () => {
    register(req)
    expect(team.create.mock.calls[0][0]).toEqual({team_id: '12345', id: '12345', token: 'abcd'})
  })

  it ('should get a list of current members', () => {
    register(req)
    expect(slackapi.users.list.mock.calls[0][0]).toEqual({token: 'abcd'})
  })
})
