const { SlashCommandBuilder } = require('discord.js')
const Action = require('../app/Action')
const { hookChannel } = require('../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updatehookchannel')
        .setDescription('delete all content and repost mission hooks'),
    async execute (interaction, client) {
        await Action.updateHookChannel(client, hookChannel)
        await interaction.reply({
            content: '**Mission hooks updated successfull** in <#' +
                hookChannel + '>',
            ephemeral: true
        })
    }
}
