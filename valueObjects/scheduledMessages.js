const {
    wMGeneralChannel, debugChannel
} = require('../config')

module.exports = {
    scheduledMessages: [
        {
            channel: wMGeneralChannel,
            cron: '0 10 * * 4',
            content: 'It\'s **HOOK** time. Add via `/hookadd` and ' +
                'remove via `/hookdelete`. Call for ' +
                'poll with `/hookpoll`'
        },
        {
            channel: debugChannel,
            cron: new Date(2022, 7, 4, 21, 43, 10),
            content: 'this specific message comes only once'
        }
    ]
}
