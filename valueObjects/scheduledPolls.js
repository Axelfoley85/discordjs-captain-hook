const {
    attendanceChannel,
    adminChannel
} = require('../config')

module.exports = {
    scheduledPolls: [
        {
            channel: adminChannel,
            cron: '0 8 * * 1',
            title: 'Anybody volunteering to',
            options: [
                'set up the donation glass, for the rent etc., at the door ' +
                'next Wednesday and putting it onto the kitchen table at ' +
                'the end of the event',
                'turn off lights, close windows, lock the door via ' +
                '"arrow sign" on door console outside and check if door ' +
                'is securely locked by manually trying the door handle ' +
                'from outside. If it wasn\'t locked properly replace ' +
                'batteries or call Mr. Nader Can, 015118088875 from ' +
                'Volkssolidarität'
            ]
        },
        {
            channel: attendanceChannel,
            cron: '1 8 * * 4',
            title: 'Are you coming next Wednesday, 7pm? What would ' +
                'you like to to do?',
            options: [
                'DM/facilitate',
                'play anything',
                'play DnD West Marches only',
                'play anything but DnD West Marches'
            ]
        }
    ]
}
