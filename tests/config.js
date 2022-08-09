const Hook = require('../valueObjects/hook')

module.exports = {
    client: {
        channels: {
            cache: {
                get () {}
            }
        }
    },
    channel: {
        bulkDelete () {},
        send () {}
    },
    message: { react () {} },
    interaction: {
        reply () {},
        followUp () {},
        update () {},
        deferUpdate () {},
        options: {
            getInteger () {},
            getString () {}
        },
        values: 1,
        user: {
            username: 'myUsername',
            id: 3
        },
        guildId: 4,
        channelId: 5,
        channel: { name: 'myChannelName' },
        type: 6
    },
    scheduledPolls: [{
        channel: '980524586028400670',
        cron: '* * * * * *',
        title: 'Chose between',
        options: [
            'One',
            'Two'
        ]
    }],
    scheduledMessages: [{
        channel: '980524586028400670',
        cron: '* * * * * *',
        content: 'message',
        execute: async (interaction, client) => {
            console.log('This should be logged')
        }
    }],
    member: {
        roles: {
            cache: { has () {} },
            add () {}
        }
    },
    author: { tag: 'authorName' },
    hook: new Hook(
        'myTitle',
        'myDM',
        1,
        2,
        'myDescr',
        3,
        4,
        5
    ),
    deleteOptions: [
        {
            label: '1, myDM',
            description: 'myDescr',
            value: 1
        }
    ]
}
