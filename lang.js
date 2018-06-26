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
  }
}
