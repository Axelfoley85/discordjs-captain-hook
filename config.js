require('dotenv').config()

module.exports = {
    clientId: process.env.clientId || 'foo',
    guildId: process.env.guildId || 'foo',
    token: process.env.token || 'foo',
    hook_channel: process.env.hook_channel || '0000',
    vote_channel: process.env.vote_channel || '000'
}
