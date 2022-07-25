const { EmbedBuilder } = require('discord.js')
const { alphabet } = require('../models/valueObjects')

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
        return new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription(content)
    }

    static addAlphabetPrefix (contentArray) {
        for (let index = 0; index < contentArray.length; index++) {
            contentArray[index] = alphabet[index] + ' ' + contentArray[index]
        }
        return contentArray
    }

    static arrayToText (lines) {
        let text = ''
        lines.forEach((line) => {
            text += line + '\n'
        })

        return text
    }
}

module.exports = MessageFormat
