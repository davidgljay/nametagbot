const profileObj = require('../../models/profile')
const slackapi = require('../../slackapi')
const lang = require('../../lang')
jest.mock('../../slackapi')

describe('profile', () => {
  it('should save the profile, open a channel and send a message', () => {
    const user = 'userid'
    slackapi.conversations.open.mockResolvedValueOnce({ok: true, channel: {id: 'channelid'}})
    slackapi.chat.postMessage.mockResolvedValueOnce({ok: true})
    return profileObj.openConvo('userid', lang.greeter.thanks())
      .then(() => {
        expect(slackapi.conversations.open.mock.calls[0][0]).toEqual({users: user})
        expect(slackapi.chat.postMessage.mock.calls[0][0]).toEqual({channel: 'channelid', text: lang.greeter.thanks(), as_user: false})
      })
  })
})
