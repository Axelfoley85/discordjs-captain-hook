import { SlashCommandBuilder } from 'discord.js'
import HooksHandler from '../app/HooksHandler.js'
import Action from '../app/Action.js'
import Interaction from '../app/Interaction.js'
import { config } from '../config.js'
const { voteChannel } = config

export default {
    data: new SlashCommandBuilder()
        .setName('hookpoll')
        .setDescription('make poll for next mission hooks'),
    async execute (interaction, client) {
        const info = Interaction.getInfos(interaction)
        const channel = client.channels.cache.get(voteChannel)
        const pollLines = await HooksHandler.getHookPollLines(info)

        await interaction.reply({
            content: 'Vote has been posted in <#' + channel + '>',
            ephemeral: true
        })

        await Action.postHookVote(pollLines, channel)
    }
}
