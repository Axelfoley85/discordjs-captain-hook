const {
    wMGeneralChannel, debugChannel, voteChannel
} = require('../config')
const Action = require('../helper/Action')
const HooksHandler = require('../helper/HooksHandler')

module.exports = {
    scheduledMessages: [
        {
            channel: wMGeneralChannel,
            cron: '0 10 * * 4',
            content: '@West Marchers\n' +
                'It\'s **HOOK POST** time. Add via `/hookadd` and ' +
                'remove via `/hookdelete`. Please finish within ' +
                '24 hours.'
        },
        {
            channel: wMGeneralChannel,
            cron: '0 10 * * 5',
            content: '@West Marchers\n' +
                'It\'s **HOOK VOTE** time. Please vote for the ' +
                'mission hooks you want to play within 24 hours.',
            execute: async (interaction, client) => {
                await Action.postHookVote(
                    await HooksHandler.getHookPollLines(),
                    client.channels.cache.get(voteChannel)
                )
            }
        },
        {
            channel: debugChannel,
            cron: new Date(2022, 7, 4, 21, 43, 10),
            content: 'this specific message comes only once'
        }
    ]
}
