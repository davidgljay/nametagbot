const register = require('../events/register')
jest.mock('../models/team')
const team = require('../models/team')

describe('register', () => {
  it('should save to the the database', () => {
    const req = {
      body: {
        team_id: '12345'
      }
    }

    register(req)
    expect(team.create.mock.calls[0][0]).toEqual({team_id: '12345', id: '12345'})
  })
})
