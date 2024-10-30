const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require('discord.js')
const HooksHandler = require('../app/HooksHandler')
const Interaction = require('../app/Interaction')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hookdelete')
        .setDescription('delete hook via select menu'),
    async execute (interaction, client) {
        const info = Interaction.getInfos(interaction)
        const deleteOptions = await HooksHandler.getHookSelectOptions(
            info,
            'delete'
        )

        if (deleteOptions[0] === undefined) {
            await interaction.reply({
                content: 'Seems you have no hooks posted. You can ' +
                    'only delete your own hooks.',
                ephemeral: true
            })
        } else {
            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('hookselect')
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
