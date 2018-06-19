const slackapi = require('../../slackapi')
const profileObj = require('../../models/profile')
const team_join = require('../../events/team_join')
const lang = require('../../lang')
jest.mock('../../slackapi')
jest.mock('../../models/profile')

describe('team_join', () => {
  let req
  let db
  beforeEach(() => {
    profileObj.create.mockReturnValueOnce(Promise.resolve())
    slackapi.conversations.open.mockReturnValueOnce({ok: true, channel: {id: 'defg'}})
    req = {body: {event: {user: {id: 'abcd'}}}}
    db = 'db'
   })

  it('should create a new profile', () =>
    team_join(req, db)
      .then(() => {
        expect(profileObj.create.mock.calls[0]).toEqual(['db', {greeter: false, id: 'abcd'}])
      })
  )

  it('should open a new conversation', () =>
    team_join(req, db)
      .then(() => {
        expect(profileObj.openConvo.mock.calls[0]).toEqual([
          'abcd',
          lang.joiner.welcome('DJ Bot Test'),
             [{
      text: 'Sound good?',
      attachment_type: "default",
      callback_id: "optin",
      actions: [
            {
              name: "optin",
              text: "Sure!",
              type: "button",
              value: "yes"
            },
            {
              name: "optin",
              text: "No thanks.",
              type: "button",
              value: "no"
            }
        ]
      }]
        ])
      })
  )
})
