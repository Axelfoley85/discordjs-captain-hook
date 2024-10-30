import { SlashCommandBuilder } from 'discord.js'
import { hookChannel } from '../config.js'
import Action from '../app/Action.js'
import Interaction from '../app/Interaction.js'
import db from '../models/index.js'
import Hook from '../valueObjects/hook.js'

export default {
    data: new SlashCommandBuilder()
        .setName('hookadd')
        .setDescription('add a mission hook')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the mission hook')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the mission hook')
                .setRequired(true))
        .addIntegerOption(
            option => option
                .setName('tier')
                .setDescription('tier level')
                .setRequired(true))
        .addIntegerOption(
            option => option
                .setName('checkpoints')
                .setDescription('checkpoints')
                .setRequired(true)),
    async execute (interaction, client) {
        const info = Interaction.getInfos(interaction)
        const hook = new Hook(
            interaction.options.getString('title'),
            info.username,
            interaction.options.getInteger('tier'),
            interaction.options.getInteger('checkpoints'),
            interaction.options.getString('description'),
            info.userId,
            info.guildId
        )

        try {
            await db.missionHooks.create(hook.dbEntry())
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                console.error('Hook title already exists:', error)
                return interaction.reply({
                    content: 'Arrrrrr, that title already exists.',
                    ephemeral: true
                })
            }
            console.error('Something went wrong!', error)
            return await Interaction.postError(interaction)
        }
        await Action.updateHookChannel(client, hookChannel, info)

        await interaction.reply({
            content: 'Mission hook created: \n' + hook.toString(),
            ephemeral: true
        })
    }
}
