const { EmbedBuilder } = require('discord.js')
const { alphabet } = require('../valueObjects/alphabet')

class MessageFormat {
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
