const {
    SlashCommandBuilder,
    ActionRowBuilder,
    SelectMenuBuilder
} = require('discord.js')
const HooksHandler = require('../helper/HooksHandler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hookdelete')
        .setDescription('delete hook via select menu'),
    async execute (interaction, client) {
        const deleteOptions = await HooksHandler.getHookDeleteOptions()

        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('hookdelete')
                    .setPlaceholder('Nothing selected')
                    .addOptions(deleteOptions)
            )

        await interaction.reply({
            content: 'Choose the hook to delete',
            components: [row],
            ephemeral: true
        })
    }
}
