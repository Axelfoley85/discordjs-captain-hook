const { SlashCommandBuilder } = require('discord.js')
const Action = require('../app/Action')
const Interaction = require('../app/Interaction')
const { hookChannel } = require('../config.js')

module.exports = {
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
