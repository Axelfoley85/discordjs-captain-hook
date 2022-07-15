const { MessageEmbed } = require('discord.js')

class MessageFormat {
    static hookToString (
        title,
        dm,
        tier,
        checkpoints,
        treasurePoints,
        description
    ) {
        let string = '**' + title + '**\n*' +
            dm + ', ' +
            'tier ' + tier + ' - ' +
            checkpoints + ' checkpoints, ' +
            treasurePoints + ' treasure points*'
        if (typeof description !== 'undefined') {
            string += '\n' + description
        }
        return string
    }

    static hookToPoll (title, dm, tier) {
        const string = '**' + title + '**, ' +
            'tier ' + tier + ', ' +
            dm

        return string
    }

    static embedMessageFrom (content) {
        return new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(content)
    }
}

module.exports = MessageFormat
