
const hiAction = require('../../actions/intro_hi')
const profileObj = require('../../models/profile')
const slackapi = require('../../slackapi')
const lang = require('../../lang')
jest.mock('../../slackapi')
jest.mock('../../models/profile')

describe('intro_hi action', () => {
  let users = [
    {
      id: 'abcd',
      name: 'Stampi',
      image: 'https://stampi.com/image.jpg',
      bio: 'A bio for stampi',
      background: 'Loves tacos'
    },
    {
      id: 'defg',
      name: 'Marvel',
      image: 'https://marvel.com/image.jpg',
      bio: 'A bio for marvel',
      background: 'Is a superhero'
    }
  ]
    let req = {
    value: users[0].id,
    user: users[1].id
  }
  let convo = {
    channel: {
      id: 'channelid'
    }
  }

  beforeEach(() => {
    profileObj.update.mockResolvedValue({})
    profileObj.get.mockResolvedValueOnce(users[0])
    profileObj.get.mockResolvedValueOnce(users[1])
    slackapi.chat.postMessage.mockResolvedValue({})
    slackapi.conversations.open.mockResolvedValue(convo)
  })

  afterEach(() => {
    profileObj.get.mock.calls = []
    slackapi.conversations.open.mock.calls = []
    slackapi.chat.postMessage.mock.calls = []
  })

  it('should update the button clicker\'s status, open a channel and invite both users', () => {
    hiAction(req, 'db').then(() => {
      expect(profileObj.update.mock.calls[0]).toEqual(['db', users[1].id, {status: 'JOINER_INTROED'}])
      expect(profileObj.push.mock.calls[0]).toEqual(['db', users[1].id, {mentees: users[0].id}])
      expect(profileObj.get.mock.calls).toEqual([['db', users[1].id], ['db', users[0].id]])
      expect(slackapi.conversations.open.calls[0][0]).toEqual({users})
      expect(slackapi.chat.postMessage.mock.calls[0]).toEqual({
        channel: convo.channel.id,
        text: lang.intro.welcome(),
        attachments: [
            {
                author_name: users[0].name,
                thumbnail_image: users[0].image,
                text: users[0].background
            },
            {
                author_name: users[1].name,
                thumbnail_image: users[1].image,
                text: users[1].background
            }
        ]
      })
    })
  })
})
