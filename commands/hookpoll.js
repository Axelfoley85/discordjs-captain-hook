const { SlashCommandBuilder } = require('@discordjs/builders')
const Hooks = require('../helper/HooksHandler')
const { vote_channel } = require('../config.js')
const { sendPollVote } = require('../helper/Action')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hookpoll')
        .setDescription('make poll for next mission hooks'),
    async execute (interaction, client) {
        const channel = client.channels.cache.get(vote_channel);
        const response = await Hooks.getPoll()

        const message = await interaction.reply({
            content: 'Vote has been posted in <#' + channel + '>',
            ephemeral: true
        })

        await sendPollVote(response, channel)
    }
}

