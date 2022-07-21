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
            getInteger () {}
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
                treasurePoints: 2,
                createdAt: '2022-07-10T03:25:51.279Z',
                updatedAt: '2022-07-10T03:25:51.279Z'
            }
        }
    ]
}
