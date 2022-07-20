const Hooks = require('./HooksHandler')
const { alphabet } = require('../models/valueObjects')
const MessageFormat = require('./MessageFormat')

class Action {
    static async postHooks () {
        const allHooks = await Hooks.get()

        const embeddedMessage = {
            embeds: [MessageFormat.embedMessageFrom(allHooks)],
            content: '**Available mission hooks**'
        }
        return embeddedMessage
    }

    static async updateHookChannel (client, channelID) {
        const channel = client.channels.cache.get(channelID)

        let deleted
        do {
            deleted = await channel.bulkDelete(100)
        } while (deleted.size !== 0)

        channel.send(await Action.postHooks())
    }

    static async sendPollVote (content, hookCount, channel) {
        const message = await channel.send({
            embeds: [MessageFormat.embedMessageFrom(content)],
            content: '**:bar_chart: HOOK! HOOK! HOOK! HOOK! HOOK!**',
            fetchReply: true
        })

        try {
            for (let i = 0; i < hookCount; i++) {
                await message.react(alphabet[i])
            }
        } catch (error) {
            console.error('One of the emojis failed to react:', error)
        }
    }
}

module.exports = Action
