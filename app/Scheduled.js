const schedule = require('node-schedule')
const { timezone } = require('../config')
const Action = require('./Action')
const HooksHandler = require('./HooksHandler')
const scheduledMessages = require('../valueObjects/scheduledMessages')
    .scheduledMessages
const scheduledPolls = require('../valueObjects/scheduledPolls').scheduledPolls

class Scheduled {
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
                console.log('Scheduling message')
                await channel.send({
                    content: message.content
                })

                if ('postPoll' in message &&
                    message.postPoll === true &&
                    'guildId' in message &&
                    'voteChannel' in message
                ) {
                    console.log('Posting custom scheduled poll')
                    await Action.postHookVote(
                        await HooksHandler.getHookPollLines({
                            guildId: message.guildId
                        }),
                        client.channels.cache.get(message.voteChannel)
                    )
                }
            })
        })
    }
}

module.exports = Scheduled
