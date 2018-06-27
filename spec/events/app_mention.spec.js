
const appMentionEvent = require('../../events/app_mention')
const appMentionObj = require('../../models/appMention')
const profileObj = require('../../models/profile')
const slackapi = require('../../slackapi')
const lang = require('../../lang')
const utils = require('../../utils')
jest.mock('../../slackapi')
jest.mock('../../models/appMention')
jest.mock('../../models/profile')
jest.mock('../../utils')

describe('app_mention', () => {
  let req = {
    body: {
      event: {
        type: 'app_mention',
        user: 'U061F7AUR',
        text: '<@U0LAN0Z89> is it everything a river should be?',
        ts: '1515449522.000016',
        channel: 'C0LAN2Q65',
        event_ts: '1515449522000016'
      }
    }
  }

  let greeters = [
    {
      name: 'Fish',
      bio: 'I am a fish',
      background: 'Open water',
      profile: {
        image_48: 'http://fish.com/me.jpg'
      },
      id: 'fsh'
    },
    {
      name: 'Octopus',
      bio: 'I am an octopus',
      background: 'Coral reef',
      profile: {
        image_48: 'http://octo.com/me.jpg'
      },
      id: 'octo'
    }
   ]

  beforeEach (() => {
    appMentionObj.create.mockReturnValue(Promise.resolve())
    profileObj.getGreeters.mockResolvedValue(greeters)
    utils.shuffle.mockImplementation((a) => a)
  })

  it('should save to the the database', () => {
    appMentionEvent(req)
    expect(appMentionObj.create.mock.calls[0][1]).toEqual(req.body.event)
  })

  it('should query the user', () => {
    profileObj.get.mockReturnValue(null)
    appMentionEvent(req)
    expect(profileObj.get.mock.calls[0][1]).toEqual(req.body.event.user)
  })

  it('should not message the user if they already exist in the databse', () => {
    profileObj.get.mockReturnValue({id: '1234'})
    return appMentionEvent(req)
      .then(() => {
        expect(profileObj.create.mock.calls.length).toEqual(0)
        expect(profileObj.openConvo.mock.calls.length).toEqual(0)
      })
  })

  it('should save the profile, open a channel and send a message if the user does not yet exist', () => {
    const user = {id: 'U061F7AUR', name: 'Stampi'}
    profileObj.get.mockReturnValue(null)
    slackapi.users.info.mockResolvedValueOnce({ok: true, user})
    slackapi.conversations.open.mockResolvedValueOnce({ok: true, channel: {id: 'channelid'}})
    return appMentionEvent(req)
      .then(() => {
        expect(slackapi.users.info.mock.calls[0][0]).toEqual({token: req.body.token, user: req.body.event.user})
        expect(profileObj.create.mock.calls[0][1]).toEqual(Object.assign({}, user, {status: 'GREETER_BACKGROUND'}))
        expect(profileObj.openConvo.mock.calls[0]).toEqual([
          req.body.event.user,
          lang.profile.background(true),
          [
            {
              author_name: greeters[0].name,
              author_icon: greeters[0].profile.image_48,
              text: greeters[0].background
            },
            {
              author_name: greeters[1].name,
              author_icon: greeters[1].profile.image_48,
              text: greeters[1].background
            }
          ]
        ])
      })
  })
})
