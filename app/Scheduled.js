import cron from 'node-cron'
import { config } from '../config.js'
import Action from './Action.js'
import HooksHandler from './HooksHandler.js'
import { scheduledMessages } from '../valueObjects/scheduledMessages.js'
import { scheduledPolls } from '../valueObjects/scheduledPolls.js'
const { timezone } = config

class Scheduled {
    static async postPolls (client, polls = scheduledPolls) {
        polls.forEach(async (poll) => {
            const job = cron.schedule(poll.cron, async () => {
                console.log('scheduling ', poll.title)
                await Action.sendPollToChannel(
                    client.channels.cache.get(poll.channel),
                    poll.title,
                    poll.options
                )
            }, {
                scheduled: true,
                timezone
            })

            console.log(job)
        })
    }

    static async postMessages (client, messages = scheduledMessages) {
        let channel
        messages.forEach(async (message) => {
            channel = client.channels.cache.get(message.channel)
            const job = cron.schedule(message.cron, async () => {
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
            }, {
                scheduled: true,
                timezone
            })

            console.log(job)
        })
    }
}

export default Scheduled
