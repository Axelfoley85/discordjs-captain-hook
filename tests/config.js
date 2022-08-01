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
        options: {
            getInteger () {},
            getString () {}
        }
    },
    missionHookEntry: [
        {
            dataValues: {
                id: 1,
                title: 'Ask for Dax Winterfield in the Golden Mug',
                // eslint-disable-next-line max-len
                description: "Ask for Dax Winterfield in the Golden Mug about the raided delivery for Aldig's Inn.",
                dm: 'Axel',
                tier: 1,
                checkpoints: 4,
                createdAt: '2022-07-10T03:25:51.279Z',
                updatedAt: '2022-07-10T03:25:51.279Z'
            }
        }
    ],
    scheduledPolls: [{
        channel: '980524586028400670',
        cron: '* * * * * *',
        title: 'Chose between',
        options: [
            'One',
            'Two'
        ]
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
        'myDescr')
}
