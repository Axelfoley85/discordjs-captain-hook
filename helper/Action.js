const { MessageEmbed } = require('discord.js')
const Hooks = require('./HooksHandler')

class Action {
    async post_hooks () {
        const response = await Hooks.get()

        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(response)
        return {
            embeds: [embed],
            content: '**Available mission hooks**'
        }
    }
}

module.exports = Action
