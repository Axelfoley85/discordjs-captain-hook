import {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} from 'discord.js'
import HooksHandler from '../app/HooksHandler.js'
import Interaction from '../app/Interaction.js'

export default {
    data: new SlashCommandBuilder()
        .setName('hookhide')
        .setDescription('hide hook via select menu'),
    async execute (interaction, client) {
        const info = Interaction.getInfos(interaction)
        const deleteOptions = await HooksHandler.getHookSelectOptions(
            info,
            'hide',
            {
                where: {
                    userId: info.userId,
                    guildId: info.guildId,
                    status: 'active'
                }
            }
        )

        if (deleteOptions[0] === undefined) {
            await interaction.reply({
                content: 'Seems you have no hooks posted. You can ' +
                    'only hide your own hooks.',
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
                content: 'Choose the hook to hide',
                components: [row],
                ephemeral: true,
                fetchReply: true
            })
        }
    }
}
