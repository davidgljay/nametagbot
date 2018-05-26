const register = require('../functions/events/register')
const team = require('../functions/models/team')

describe('register', () => {
  it('should save to the the database', () => {
    const result = {}
    const req = {
      body: {
        team_id: '12345'
      }
    }
    const teamSpy = spyOn(team, 'create')

    register(req)
    expect(teamSpy).toHaveBeenCalledWith({team_id: '12345', id: '12345'})
  })
})
