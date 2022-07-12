const { MessageEmbed } = require('discord.js')
const Hooks = require('./HooksHandler')

class Action {
    static async postHooks () {
        const response = await Hooks.get()

        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(response)
        return {
            embeds: [embed],
            content: '**Available mission hooks**'
        }
    }

    static async deleteAllMessages (client, channelID) {
        const channel = client.channels.cache.get(channelID);
        (async () => {
            let deleted
            do {
                deleted = await channel.bulkDelete(100)
            } while (deleted.size !== 0)
        })()
        // let fetched
        // const channel = client.channels.cache.get(channelID)
        // do {
        //     fetched = await channel.fetchMessages({ limit: 100 })
        //     message.channel.bulkDelete(fetched)
        // }
        // while (fetched.size >= 2)
    }
}

module.exports = Action
