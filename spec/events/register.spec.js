
const register = require('../../events/register')
const team = require('../../models/team')
const slackapi = require('../../slackapi')
jest.mock('../../models/team')
jest.mock('../../slackapi')

describe('register', () => {
  const req = {
        query: {
          code: '1234'
        }
      }
  const users = [
    {
      name: 'Tavi',
      id: 'abc',
      profile: {
        is_admin: true
      }
    },
    {
      name: 'Mazel',
      id: 'def',
      profile: {
        is_admin: false
      }
    }
  ]

  beforeEach (() => {
    slackapi.oauth.access.mockResolvedValue({
      body: {
        team_id: '12345'
      }
    })
    slackapi.users.list.mockResolvedValue(users)
    team.create.mockReturnValue(Promise.resolve())
  })

  it('should save the team to the the database', () => {
    register(req)
      .then(() => {
        expect(team.create.mock.calls[0][0]).toEqual({team_id: '12345', id: '12345', token: 'abcd'})
      })
  })

  it('should save profiles for admins and reach out', () => {
    register(req)
      .then(() => {
        expect(profile.create.mock.calls[0][0]).toEqual(users[0])
        expect(profile.openConvo.mock.calls[0]).toEqual([
          users[0].id,
          lang.admin.welcome(),
          [{
            text: lang.admin.example()
          }]])
      })
  })
})
