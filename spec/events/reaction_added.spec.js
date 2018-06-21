
const reactionAddedEvent = require('../../events/reaction_added')
const appMentionObj = require('../../models/appMention')
const profileObj = require('../../models/profile')
const slackapi = require('../../slackapi')
const lang = require('../../lang')
const utils = require('../../utils')

jest.mock('../../slackapi')
jest.mock('../../models/appMention')
jest.mock('../../models/profile')
jest.mock('../../utils')

describe('reaction_added', () => {
  let req = {
    body: {
      event: {
        type: 'reaction_added',
        user: 'U024BE7LH',
        reaction: 'thumbsup',
        item_user: 'U0G9QF9C6',
        item: {
            type: 'message',
            channel: 'C0G9QF9GZ',
            ts: '1360782400.498405'
          },
        event_ts: '1360782804.083113'
      }
    }
  }
  let greeters = [
    {
      name: 'Fish',
      bio: 'I am a fish',
      background: 'Open water',
      image: 'http://fish.com/me.jpg',
      id: 'fsh'
    },
    {
      name: 'Octopus',
      bio: 'I am an octopus',
      background: 'Coral reef',
      image: 'http://octo.com/me.jpg',
      id: 'octo'
    }
   ]

  beforeEach (() => {
    appMentionObj.create.mockReturnValue(Promise.resolve())
    profileObj.getGreeters.mockResolvedValue(greeters)
    utils.shuffle.mockImplementation((a) => a)
  })

  it('should query for an app mention', () => {
    appMentionObj.getByTs.mockResolvedValueOnce(null)
    return reactionAddedEvent(req)
      .then(() => {
        expect(appMentionObj.getByTs.mock.calls[0][1]).toEqual(req.body.event.item.ts)
      })
  })

  it('should not message the user if the app mention is not found', () => {
    appMentionObj.getByTs.mockResolvedValueOnce(null)
    return reactionAddedEvent(req)
      .then(() => {
        expect(profileObj.create.mock.calls.length).toEqual(0)
        expect(profileObj.openConvo.mock.calls.length).toEqual(0)
      })
  })

  it('should not message the user if they already exist in the database', () => {
    appMentionObj.getByTs.mockResolvedValueOnce({id: 'abcd'})
    profileObj.get.mockResolvedValueOnce({id: '1234'})
    return reactionAddedEvent(req)
      .then(() => {
        expect(profileObj.create.mock.calls.length).toEqual(0)
        expect(profileObj.openConvo.mock.calls.length).toEqual(0)
      })
  })

  it('should save the profile, open a channel and send a message if the user does not yet exist and the app mention has been found', () => {
    const user = {id: 'U061F7AUR', name: 'Stampi'}
    profileObj.get.mockResolvedValueOnce(null)
    appMentionObj.getByTs.mockResolvedValueOnce({id: 'abcd'})
    slackapi.users.info.mockResolvedValueOnce({ok: true, user})
    slackapi.conversations.open.mockResolvedValueOnce({ok: true, channel: {id: 'channelid'}})
    return reactionAddedEvent(req)
      .then(() => {
        expect(slackapi.users.info.mock.calls[0][0]).toEqual({token: req.body.token, user: req.body.event.user})
        expect(profileObj.create.mock.calls[0][1]).toEqual(Object.assign({}, user, {status: 'GREETER_BACKGROUND'}))
        expect(profileObj.openConvo.mock.calls[0]).toEqual([
          req.body.event.user,
          lang.profile.background(true),
          [
            {
              author_name: 'Fish',
              text: 'Open water',
              thumbnail: 'http://fish.com/me.jpg'
            },
            {
              author_name: 'Octopus',
              text: 'Coral reef',
              thumbnail: 'http://octo.com/me.jpg'
            }
          ]
        ])
      })
  })
})
