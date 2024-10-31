import { SlashCommandBuilder } from 'discord.js'
import Action from '../app/Action.js'
import Interaction from '../app/Interaction.js'
import { config } from '../config.js'
const { hookChannel } = config

export default {
    data: new SlashCommandBuilder()
        .setName('updatehookchannel')
        .setDescription('delete all content and repost mission hooks'),
    async execute (interaction, client) {
        const info = Interaction.getInfos(interaction)

        await Action.updateHookChannel(client, hookChannel, info)

        await interaction.reply({
            content: '**Mission hooks updated successfull** in <#' +
                hookChannel + '>',
            ephemeral: true
        })
    }
}
