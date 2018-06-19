
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
  
  beforeEach(() => {
    profileObj.update.mockResolvedValue({})
    slackapi.chat.postMessage.mockResolvedValue({ok: true})
    utils.shuffle.mockImplementation((a) => a)
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
        expect(slackapi.chat.postMessage.mock.calls[0][0]).toEqual({as_user: false, channel: 'C0LAN2Q65', text: lang.profile.bio()})
      })
  })

  it('should update the bio if the user status is JOINER_BIO', () => {
     profileObj.get.mockResolvedValueOnce({
      id: 'U061F7AUR',
      name: 'Patti',
      background: 'background!',
      status: 'JOINER_BIO'
    })
    profileObj.getGreeters.mockResolvedValueOnce([
      {
        bio: 'I am a fish',
        image: 'http://fish.com/me.jpg',
        id: 'fsh'
      },
      {
        bio: 'I am an octopus',
        image: 'http://octo.com/me.jpg',
        id: 'octo'
      }
     ])
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
    profileObj.getGreeters.mockResolvedValueOnce([
      {
        bio: 'I am a fish',
        image: 'http://fish.com/me.jpg',
        id: 'fsh'
      },
      {
        bio: 'I am an octopus',
        image: 'http://octo.com/me.jpg',
        id: 'octo'
      }
     ])
    return messageEvent(req, db)
      .then(() => {
        expect(slackapi.chat.postMessage.mock.calls[0][0]).toEqual({
          channel: 'C0LAN2Q65',
          text: lang.joiner.intros(),
          attachments: [
            {
              channel_id: 'intro',
              text: 'I am a fish',
              author_name: 'http://fish.com/me.jpg',
              actions: [{
                  value: 'fsh',
                  text: "Say hi"
              }]
            },
            {
              channel_id: 'intro',
              text: 'I am an octopus',
              author_name: 'http://octo.com/me.jpg',
              actions: [{
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
        expect(slackapi.chat.postMessage.mock.calls[0][0]).toEqual({as_user: false, channel: 'C0LAN2Q65', text: lang.profile.bio()})
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
        expect(slackapi.chat.postMessage.mock.calls[0][0]).toEqual({as_user: false, channel: 'C0LAN2Q65', text: lang.greeter.thanks()})
      })
  })
})
