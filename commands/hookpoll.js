const { SlashCommandBuilder } = require('@discordjs/builders')
const Hooks = require('../helper/HooksHandler')
const Action = require('../helper/Action')
const { voteChannel } = require('../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hookpoll')
        .setDescription('make poll for next mission hooks'),
    async execute (interaction, client) {
        const channel = client.channels.cache.get(voteChannel)
        const response = await Hooks.getPoll()

        await interaction.reply({
            content: 'Vote has been posted in <#' + channel + '>',
            ephemeral: true
        })

        await Action.sendPollVote(response[0], response[1], channel)
    }
}
