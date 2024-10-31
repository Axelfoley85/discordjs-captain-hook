import {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} from 'discord.js'
import HooksHandler from '../app/HooksHandler.js'
import Interaction from '../app/Interaction.js'

export default {
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
