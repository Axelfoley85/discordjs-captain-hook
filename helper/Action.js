const HooksHandler = require('./HooksHandler')
const MessageFormat = require('./MessageFormat')
const schedule = require('node-schedule')
const { timezone, hookChannel } = require('../config')
const alphabet = require('../valueObjects/alphabet').alphabet
const scheduledMessages = require('../valueObjects/scheduledMessages')
    .scheduledMessages
const scheduledPolls = require('../valueObjects/scheduledPolls').scheduledPolls

class Action {
    static async postHooks () {
        const allHooks = await HooksHandler.getFullHookDescriptions()

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

        await channel.send(await Action.postHooks())
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
            const rule = new schedule.RecurrenceRule()
            rule.tz = timezone

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

    static async postMessages (client, messages = scheduledMessages) {
        let channel
        messages.forEach(async (message) => {
            channel = client.channels.cache.get(message.channel)
            const rule = new schedule.RecurrenceRule()
            rule.tz = timezone

            schedule.scheduleJob(message.cron, async () => {
                console.log('sending scheduled message!')
                await channel.send({
                    content: message.content
                })
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
            try {
                await member.roles.add(role.id)
            } catch (error) {
                console.error('There has been an error assigning roles!', error)
            }

            console.log(
                `The role ${role.name} ` +
                `has been added to ${user.tag}.`
            )
        }
    }

    static async deleteHookFromSelect (interaction, client, deleteId) {
        await HooksHandler.delete(deleteId)
        await Action.updateHookChannel(client, hookChannel)

        await interaction.followUp({
            content: `Hook with id: ${deleteId} was deleted.` +
                ` See updated list in <#${hookChannel}>`,
            ephemeral: true
        })
    }
}

module.exports = Action
