require('dotenv').config()

module.exports = {
    clientId: process.env.clientId || 'foo',
    guildId: process.env.guildId || 'foo',
    token: process.env.token || 'foo',
    hookChannel: process.env.hookChannel || '0000',
    voteChannel: process.env.voteChannel || '000',
    adminChannel: process.env.adminChannel || '1234',
    debugChannel: process.env.debugChannel || '5678'
}
