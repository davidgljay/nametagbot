
const appMentionEvent = require('../events/app_mention')
const appMentionObj = require('../models/AppMention')
const slackapi = require('../slackapi')
jest.mock('../slackapi')
jest.mock('../models/AppMention')

describe('app_mention', () => {
  let req = {
    body: {
      type: 'app_mention',
      user: 'U061F7AUR',
      text: '<@U0LAN0Z89> is it everything a river should be?',
      ts: '1515449522.000016',
      channel: 'C0LAN2Q65',
      event_ts: '1515449522000016'
    }
  }

  beforeEach (() => {
    appMentionObj.create.mockReturnValue(Promise.resolve())
  })

  it('should save to the the database', () => {
    appMentionEvent(req)
    expect(appMentionObj.create.mock.calls[0][0]).toEqual(req.body)
  })
})
