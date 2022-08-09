const {
    SlashCommandBuilder,
    ActionRowBuilder,
    SelectMenuBuilder
} = require('discord.js')
const HooksHandler = require('../app/HooksHandler')
const Interaction = require('../app/Interaction')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hookdelete')
        .setDescription('delete hook via select menu'),
    async execute (interaction, client) {
        const info = Interaction.getInfos(interaction)
        const deleteOptions = await HooksHandler.getHookDeleteOptions(info)

        if (deleteOptions[0] === undefined) {
            await interaction.reply({
                content: 'No hooks found to delete',
                ephemeral: true
            })
        } else {
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
                ephemeral: true,
                fetchReply: true
            })
        }
    }
}
