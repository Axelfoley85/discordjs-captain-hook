import Action from '../app/Action.js'
import { westMarchesRole } from '../valueObjects/roles.js'
import { westmarchChannels } from '../valueObjects/westmarchChannels.js'

export default {
    name: 'messageCreate',
    async execute (client, message) {
        const author = message.author
        const member = message.member
        const channelId = message.channelId
        const channel = client.channels.cache.get(channelId)
        console.log(
            `${author.tag} send a message in ` +
            `${channel.name}.`
        )

        if (westmarchChannels.includes(channelId)) {
            await Action.assignRole(member, author, westMarchesRole)
        }
    }
}
