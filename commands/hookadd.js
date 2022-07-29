const { SlashCommandBuilder } = require('discord.js')
// const MissionHooks = require('../models/MissionHooks.js')
const { hookChannel } = require('../config.js')
const Action = require('../helper/Action.js')
const MessageFormat = require('../helper/MessageFormat')
const db = require('../models/index.js')

module.exports = {
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
        .addStringOption(
            option => option
                .setName('dm')
                .setDescription('dm of session')
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
        const title = interaction.options.getString('title')
        const description = interaction.options.getString('description')
        const dm = interaction.options.getString('dm')
        const tier = interaction.options.getInteger('tier')
        const checkpoints = interaction.options.getInteger('checkpoints')

        try {
            await db.missionHooks.create({
                title,
                description,
                dm,
                tier,
                checkpoints
            })
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                console.error('Hook title already exists:', error)
                return interaction.reply({
                    content: 'Arrrrrr, that title already exists.',
                    ephemeral: true
                })
            }
            console.error('Something went wrong!', error)
            return interaction.reply({
                content: 'Arrrr, something went wrong!',
                ephemeral: true
            })
        }
        await Action.updateHookChannel(client, hookChannel)

        await interaction.reply({
            content: 'Mission hook created: \n' + MessageFormat.hookToString(
                title,
                dm,
                tier,
                checkpoints,
                description
            ),
            ephemeral: true
        })
    }
}
