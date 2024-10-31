import Hook from '../valueObjects/hook.js'

export const mock = {
    client: {
        channels: {
            cache: {
                get () {}
            }
        },
        user: { setPresence () {} },
        once () {},
        on () {},
        commands: {
            set () {},
            get () {}
        },
        login () {}
    },
    hook: new Hook(
        'myTitle', 'myDM', 1, 2, 'myDescr', 3, 4, 5
    ),
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
        values: [1],
        user: {
            username: 'myUsername',
            id: 3
        },
        guildId: 4,
        channelId: 5,
        channel: { name: 'myChannelName' },
        type: 6,
        isChatInputCommand () { return true },
        isSelectMenu () { return true },
        isButton () { return true },
        customId: 'hookselect',
        version: 1,
        token: 'unique_interaction_token',
        message: {
            type: 0,
            tts: false,
            timestamp: '2021-05-19T02:12:51.710000+00:00',
            pinned: false,
            mentions: [],
            mention_roles: [],
            mention_everyone: false,
            id: '844397162624450620',
            flags: 0,
            embeds: [],
            edited_timestamp: null,
            content: 'This is a message with components.',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: 'Click me!',
                            style: 1,
                            custom_id: 'click_one'
                        }
                    ]
                }
            ],
            channel_id: '345626669114982402',
            author: {
                username: 'Mason',
                public_flags: 131141,
                id: '53908232506183680',
                discriminator: '1337',
                avatar: 'a_d5efa99b3eeaa7dd43acca82f5692432'
            },
            attachments: []
        },
        member: {
            user: {
                username: 'Mason',
                public_flags: 131141,
                id: '53908232506183680',
                discriminator: '1337',
                avatar: 'a_d5efa99b3eeaa7dd43acca82f5692432'
            },
            roles: [
                '290926798626357999'
            ],
            premium_since: null,
            permissions: '17179869183',
            pending: false,
            nick: null,
            mute: false,
            joined_at: '2017-03-13T19:19:14.040000+00:00',
            is_pending: false,
            deaf: false,
            avatar: null
        },
        id: '846462639134605312',
        guild_id: '290926798626357999',
        data: {
            custom_id: 'click_one',
            component_type: 2
        },
        channel_id: '345626669114982999',
        application_id: '290926444748734465'
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
        postPoll: true,
        guildId: '966698643572809800',
        voteChannel: '1006624625716895865'
    }],
    member: {
        roles: {
            cache: { has () {} },
            add () {}
        }
    },
    author: { tag: 'authorName' },
    deleteOptions: [
        {
            label: '1, myDM',
            description: 'myDescr',
            value: 1
        }
    ],
    command: { execute () {} }
}

export const hook = new Hook(
    'myTitle', 'myDM', 1, 2, 'myDescr', 3, 4
)
