const { adminChannel, attendanceChannel } = require('../config')

module.exports = {
    alphabet: [
        '🇦',
        '🇧',
        '🇨',
        '🇩',
        '🇪',
        '🇫',
        '🇬',
        '🇭',
        '🇮',
        '🇯',
        '🇰',
        '🇱',
        '🇲',
        '🇳',
        '🇴',
        '🇵',
        '🇶',
        '🇷',
        '🇸',
        '🇹',
        '🇺',
        '🇻',
        '🇼',
        '🇽',
        '🇾',
        '🇿'
    ],
    // cron is in UTC !!!
    scheduledPolls: [
        {
            channel: adminChannel,
            cron: '0 10 * * 1',
            title: 'Anybody volunteering to',
            options: [
                'set up the donation glass, for the rent etc., at the door ' +
                'next Wednesday and putting it onto the kitchen table at ' +
                'the end of the event',
                'turn off lights, close windows, lock the door via ' +
                '"arrow sign" on door console outside and check if door ' +
                'is securely locked by manually trying the door handle ' +
                'from outside. If it wasn\'t locked properly replace ' +
                'batteries or call Mr. Nader, 015118088875 from ' +
                'Volkssolidarität'
            ]
        },
        {
            channel: attendanceChannel,
            cron: '0 10 * * 4',
            title: 'Who is coming next Wednesday, 7pm',
            options: [
                'I want to play',
                'I want to DM/facilitate',
                'I won\'t be there '
            ]
        }
    ]
}
