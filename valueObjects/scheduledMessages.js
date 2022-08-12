const {
    wMGeneralChannel
} = require('../config')
const { westMarchesRole } = require('./roles')

module.exports = {
    scheduledMessages: [
        {
            channel: wMGeneralChannel,
            cron: '2 12 * * 4',
            content: `<@&${westMarchesRole.id}>\n` +
                'It\'s **HOOK POST** time. Add via `/hookadd` and ' +
                'remove via `/hookdelete`. Please finish within ' +
                '24 hours.'
        },
        {
            channel: wMGeneralChannel,
            cron: '0 10 * * 5',
            content: `<@&${westMarchesRole.id}>\n` +
                'It\'s **HOOK VOTE** time. Please vote for the ' +
                'mission hooks you want to play within 24 hours.',
            postPoll: true,
            guildId: '966698643572809800',
            voteChannel: '992389239612387328'
        // },
        // {
        //     channel: '1006624625716895865',
        //     cron: '*/5 * * * * *',
        //     content: `<@&${westMarchesRole.id}>\n` +
        //         'It\'s **HOOK VOTE** time. Please vote for the ' +
        //         'mission hooks you want to play within 24 hours.',
        //     postPoll: true,
        //     guildId: '966698643572809800',
        //     voteChannel: '1006624625716895865'
        }
        // {
        //     channel: debugChannel,
        //     cron: new Date(2022, 7, 4, 21, 43, 10),
        //     content: 'this specific message comes only once'
        // },
    ]
}
