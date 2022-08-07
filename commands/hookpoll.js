const { SlashCommandBuilder } = require('discord.js')
const HooksHandler = require('../app/HooksHandler')
const Action = require('../app/Action')
const { voteChannel } = require('../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hookpoll')
        .setDescription('make poll for next mission hooks'),
    async execute (interaction, client) {
        const channel = client.channels.cache.get(voteChannel)
        const response = await HooksHandler.getHookPollLines()

        await interaction.reply({
            content: 'Vote has been posted in <#' + channel + '>',
            ephemeral: true
        })

        await Action.postHookVote(response, channel)
    }
}
