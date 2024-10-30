import { EmbedBuilder } from 'discord.js'
import { alphabet } from '../valueObjects/alphabet.js'

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

export default MessageFormat
