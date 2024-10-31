import {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} from 'discord.js'
import HooksHandler from '../app/HooksHandler.js'
import Interaction from '../app/Interaction.js'

export default {
    data: new SlashCommandBuilder()
        .setName('hookunhide')
        .setDescription('reveal hidden hook via select menu'),
    async execute (interaction, client) {
        const info = Interaction.getInfos(interaction)
        const deleteOptions = await HooksHandler.getHookSelectOptions(
            info,
            'unhide',
            {
                where: {
                    userId: info.userId,
                    guildId: info.guildId,
                    status: 'hidden'
                }
            }
        )

        if (deleteOptions[0] === undefined) {
            await interaction.reply({
                content: 'Seems you have no hooks hidden. You can ' +
                    'only unhide your own hooks.',
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
                content: 'Choose the hook to unhide',
                components: [row],
                ephemeral: true,
                fetchReply: true
            })
        }
    }
}
