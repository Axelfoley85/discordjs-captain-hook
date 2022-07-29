const Hooks = require('./HooksHandler')
const MessageFormat = require('./MessageFormat')
const schedule = require('node-schedule')
const alphabet = require('../valueObjects/alphabet').alphabet
const scheduledPolls = require('../valueObjects/scheduledPolls').scheduledPolls

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

    static async postHookVote (content, channel) {
        const title = '**:bar_chart: HOOK! HOOK! HOOK! HOOK! HOOK!**'
        await Action.sendPollToChannel(
            channel,
            title,
            content
        )
    }

    static async sendPollToChannel (channel, title, contentArray) {
        let contentArr = [].concat(contentArray)

        contentArr = MessageFormat.addAlphabetPrefix(contentArr)
        const message = await channel.send({
            embeds: [MessageFormat.embedMessageFrom(
                MessageFormat.arrayToText(contentArr)
            )],
            content: title,
            fetchReply: true
        })

        try {
            for (let i = 0; i < contentArr.length; i++) {
                await message.react(alphabet[i])
            }
        } catch (error) {
            console.error('One of the emojis failed to react:', error)
        }
    }

    static async postPolls (client, polls = scheduledPolls) {
        polls.forEach(async (poll) => {
            schedule.scheduleJob(poll.cron, async () => {
                console.log('scheduling ', poll.title)
                await Action.sendPollToChannel(
                    client.channels.cache.get(poll.channel),
                    poll.title,
                    poll.options
                )
            })
        })
    }

    static async assignRole (member, user, role) {
        if (member.roles.cache.has(role.id)) {
            console.log(
                `${user.tag}, ` +
                'already has this role!'
            )
        } else {
            await member.roles.add(role.id)
                .catch((e) => console.log(e))

            console.log(
                `The role ${role.name} ` +
                `has been added to ${user.tag}.`
            )
        }
    }
}

module.exports = Action
