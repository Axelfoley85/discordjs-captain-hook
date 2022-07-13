const { SlashCommandBuilder } = require('@discordjs/builders')
const Action = require('../helper/Action')
const { hook_channel } = require('../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updatehookchannel')
        .setDescription('delete all content and repost mission hooks'),
    async execute (interaction, client) {
        await Action.updateHookChannel(client, hook_channel)
        await interaction.reply('**Mission hooks updated successfull**')
    }
}
