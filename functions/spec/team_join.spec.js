jest.mock('../slackapi')
jest.mock('../models/profile')
// jest.mock('firebase-functions')

const slackapi = require('../slackapi')

const profile = require('../models/profile')
const team_join = require('../events/team_join')
const lang = require('../lang')


describe('team_join', () => {
  let req
  beforeEach(() => {
    profile.create.mockReturnValueOnce(Promise.resolve())
    slackapi.conversations.open.mockReturnValueOnce({ok: true, channel: {id: 'defg'}})
    req = {body: {token: '12345', event: {user: {id: 'abcd'}}}}
   })

  it('should create a new profile', () =>
    team_join(req)
      .then(() => {
        expect(profile.create.mock.calls[0][0]).toEqual({id: 'abcd'})
      })
  )

  it('should open a channel', () =>
    team_join(req)
      .then(() => {
        expect(slackapi.conversations.open.mock.calls[0][0]).toEqual({token: '12345', users: 'abcd'})
      })
  )

  it('should post a message', () =>
    team_join(req)
      .then(() => {
        expect(slackapi.chat.postMessage.mock.calls[0][0]).toEqual({
          as_user: false,
          channel: 'defg',
          text: lang.newMember.welcome()
        })
      })
  )
})
