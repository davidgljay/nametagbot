jest.mock('../../slackapi')
jest.mock('../../models/profile')

const slackapi = require('../../slackapi')

const profileObj = require('../../models/profile')
const team_join = require('../../events/team_join')
const lang = require('../../lang')


describe('team_join', () => {
  let req
  beforeEach(() => {
    profileObj.create.mockReturnValueOnce(Promise.resolve())
    slackapi.conversations.open.mockReturnValueOnce({ok: true, channel: {id: 'defg'}})
    req = {body: {token: '12345', event: {user: {id: 'abcd'}}}}
   })

  it('should create a new profile', () =>
    team_join(req)
      .then(() => {
        expect(profileObj.create.mock.calls[0][0]).toEqual({id: 'abcd'})
      })
  )

  it('should open a new conversation', () =>
    team_join(req)
      .then(() => {
        expect(profileObj.openConvo.mock.calls[0]).toEqual(['12345', 'abcd', lang.newMember.welcome()])
      })
  )
})
