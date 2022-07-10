require('dotenv').config()

module.exports = {
    clientId: process.env.clientId || 'foo',
    guildId: process.env.guildId || 'foo',
    token: process.env.token || 'foo'
}
