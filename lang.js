module.exports = {
  joiner: {
    welcome: (teamName) => `Welcome to ${teamName}! Several people from this group have volunteered to help welcome new people like you, I'd love to connect you with one who matches your interests.`,
    nothanks: () => 'No problem, just type "join" if you change your mind.',
    intros: () => '💯! Here are a few folks from the community who would be excited to chat with you:',
    connected: () => 'Great! I\'ve introduced the two of you in a private channel.'
  },
  profile: {
    background: (greeters) => `Great! To get started, briefly share your background. ${greeters ? 'Here\'s what other people from the community have said:' : ''}`,
    bio: (greeters) => `Cool, now give us a sense of what brings you here. Why did you decide to join this community? ${greeters ? 'Here\'s what a few other people have said:' : ''}`
  },
  greeter: {
    thanks: () => 'Thanks! I\'ve added you to a special #greeters channel and will connect you with new people as they join.'
  },
  intro: {
    welcome: (joiner, greeter) => `<@${joiner}>, meet <@${greeter}>. <@${joiner}> is new here and would love to learn more about the community.`
  },
  admin: {
    welcome: () => 'Hi, I\'m <@IntroBot>! I help new people get plugged into your community. Here\'s how it works:\n' +
                '1. You can recruit volunteers who will greet new members.\n' +
                '2. These volunteers will share a little about who they are and why they are a part of this community.\n' +
                '3. When a new person joins, they\'ll be matched with a volunteer for a one-on-one conversation.\n' +
                '4. You\'ll be able to see metrics about how many new people are joining and getting into meaningful conversations.\n' +
                'To get started, just mentiong <@IntroBot> in a public post. Here\'s an example:',
    example: () => 'Hey everyone, I wanted to try out a new thing called <@IntroBot> which helps new people get plugged into the community.' +
                'If you\'d like to volunteer just :thumbsup: this message, you\'ll get asked a little about yourself and then new members will' +
                'get connected with you from time to time.'
  }
}
