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
        options: {
            getInteger () {},
            getString () {}
        },
        values: 1
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
        content: 'message'
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
        1,
        'myDescr',
        1
    ),
    deleteOptions: [
        {
            label: '1, myDM',
            description: 'myDescr',
            value: 1
        }
    ]
}
