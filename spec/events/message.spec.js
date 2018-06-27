
const messageEvent = require('../../events/message')
const profileObj = require('../../models/profile')
const slackapi = require('../../slackapi')
const lang = require('../../lang')
const utils = require('../../utils')
jest.mock('../../slackapi')
jest.mock('../../models/profile')
jest.mock('../../utils')

describe('message', () => {
  let req = {
    body: {
      event: {
        type: 'message',
        user: 'U061F7AUR',
        text: 'Banana phone!',
        ts: '1515449522.000016',
        channel: 'C0LAN2Q65',
        event_ts: '1515449522000016'
      }
    }
  }
  let db = 'db'
  let greeters = [
    {
      name: 'Fish',
      bio: 'I am a fish',
      background: 'Open water',
      profile: {
        image_48: 'http://fish.com/me.jpg',
        image_72: 'http://fish.com/me.jpg'
      },
      id: 'fsh'
    },
    {
      name: 'Octopus',
      bio: 'I am an octopus',
      background: 'Coral reef',
      profile: {
        image_48: 'http://octo.com/me.jpg',
        image_72: 'http://octo.com/me.jpg'
      },
      id: 'octo'
    }
   ]

  beforeEach(() => {
    profileObj.update.mockResolvedValue({})
    slackapi.chat.postMessage.mockResolvedValue({ok: true})
    slackapi.app.channels.join.mockResolvedValue({id: 'greetersid'})
    utils.shuffle.mockImplementation((a) => a)
    profileObj.getGreeters.mockResolvedValueOnce(greeters)
  })

  afterEach(() => {
    profileObj.update.mock.calls = []
    slackapi.chat.postMessage.mock.calls = []
  })

  it('should do nothing if no user is found', () => {
    profileObj.get.mockResolvedValue(null)
    return messageEvent(req, db).then(() => {
      expect(profileObj.update.mock.calls.length).toEqual(0)
    })
  })

  it('should update the background the user status is JOINER_BACKGROUND', () => {
    profileObj.get.mockResolvedValueOnce({
      id: 'U061F7AUR',
      name: 'Patti',
      status: 'JOINER_BACKGROUND'
    })
    return messageEvent(req, db)
      .then(() => {
        expect(profileObj.update.mock.calls[0]).toEqual(['db', 'U061F7AUR', {background: 'Banana phone!', status: 'JOINER_BIO'}])
        expect(slackapi.chat.postMessage.mock.calls[0][0]).toEqual({
          channel: 'C0LAN2Q65',
          text: lang.profile.bio(true),
          attachments: [
            {
              channel_id: 'intro',
              text: 'I am a fish',
              author_name: 'Fish',
              author_icon: 'http://fish.com/me.jpg'
            },
            {
              channel_id: 'intro',
              text: 'I am an octopus',
              author_name: 'Octopus',
              author_icon: 'http://octo.com/me.jpg'
            }
          ]
        })
      })
  })

  it('should update the bio if the user status is JOINER_BIO', () => {
     profileObj.get.mockResolvedValueOnce({
      id: 'U061F7AUR',
      name: 'Patti',
      background: 'background!',
      status: 'JOINER_BIO'
    })
    return messageEvent(req, db)
      .then(() => {
        expect(profileObj.update.mock.calls[0]).toEqual(['db', 'U061F7AUR', {bio: 'Banana phone!', status: 'JOINER_INTROS'}])
      })
  })

  it('should post the message with greeters if the status is JOINER_BIO', () => {
     profileObj.get.mockResolvedValueOnce({
      id: 'U061F7AUR',
      name: 'Patti',
      background: 'background!',
      status: 'JOINER_BIO'
    })
    return messageEvent(req, db)
      .then(() => {
        expect(slackapi.chat.postMessage.mock.calls[0][0]).toEqual({
          channel: 'C0LAN2Q65',
          text: lang.joiner.intros(),
          attachments: [
            {
              callback_id: 'intro',
              text: `${greeters[0].background}\n\n${greeters[0].bio}`,
              author_name: 'Fish',
              thumb_url: 'http://fish.com/me.jpg',
              actions: [{
                  name: 'hi',
                  type: 'button',
                  value: 'fsh',
                  text: "Say hi"
              }]
            },
            {
              callback_id: 'intro',
              text: `${greeters[1].background}\n\n${greeters[1].bio}`,
              author_name: 'Octopus',
              thumb_url: 'http://octo.com/me.jpg',
              actions: [{
                  name: 'hi',
                  type: 'button',
                  value: 'octo',
                  text: "Say hi"
              }]
            }
          ]
        })
      })
  })

   it('should update the background if the user status is GREETER_BACKGROUND', () => {
    profileObj.get.mockResolvedValueOnce({
      id: 'U061F7AUR',
      name: 'Patti',
      status: 'GREETER_BACKGROUND'
    })
    return messageEvent(req, db)
      .then(() => {
        expect(profileObj.update.mock.calls[0]).toEqual(['db', 'U061F7AUR', {background: 'Banana phone!', status: 'GREETER_BIO'}])
        expect(slackapi.chat.postMessage.mock.calls[0][0]).toEqual({
          channel: 'C0LAN2Q65',
          text: lang.profile.bio(true),
          attachments: [
            {
              channel_id: 'intro',
              text: 'I am a fish',
              author_name: 'Fish',
              author_icon: 'http://fish.com/me.jpg'
            },
            {
              channel_id: 'intro',
              text: 'I am an octopus',
              author_name: 'Octopus',
              author_icon: 'http://octo.com/me.jpg'
            }
          ]
        })
      })
  })

  it('should update the bio if the user status is GREETER_BIO', () => {
     profileObj.get.mockResolvedValueOnce({
      id: 'U061F7AUR',
      name: 'Patti',
      background: 'background!',
      status: 'GREETER_BIO'
    })
    return messageEvent(req, db)
      .then(() => {
        expect(profileObj.update.mock.calls[0]).toEqual(['db', 'U061F7AUR', {bio: 'Banana phone!', status: 'GREETER_READY'}])
        expect(slackapi.chat.postMessage.mock.calls[0][0]).toEqual({
          channel: 'C0LAN2Q65',
          text: lang.greeter.thanks()
        })
      })
  })
})
