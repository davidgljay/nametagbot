module.exports = {
  newMember: {
    welcome: (teamName) => `Welcome to ${teamName}! Several people from this group have volunteered to help welcome new people like you, I'd love to connect you with one who matches your interests. Sound good?`,
    nothanks: () => 'No problem, just type "join" if you change your mind.'
  },
  profile: {
    background: () => 'Great! To get started, briefly share your background. Here\'s what other people from the community have said:',
    bio: () => 'Cool, now give us a sense of what brings you here. Why did you decide to join this community? Here\'s what a few other people have said:'
  },
  greeter: {
    thanks: () => 'Thanks! I\'ve added you to a special #greeters channel and will connect you with new people as they join.'
  }
}
