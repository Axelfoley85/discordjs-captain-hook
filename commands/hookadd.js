const { SlashCommandBuilder } = require('@discordjs/builders')
const MissionHook = require('../models/missionHook.js')
const { hookToString } = require('../helper/MessageFormat')
const { hookChannel } = require('../config.js')
const { updateHookChannel } = require('../helper/Action.js')

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
                .setRequired(true))
        .addIntegerOption(
            option => option
                .setName('treasurepoints')
                .setDescription('treasure points')
                .setRequired(true)),
    async execute (interaction, client) {
        const title = interaction.options.getString('title')
        const description = interaction.options.getString('description')
        const dm = interaction.options.getString('dm')
        const tier = interaction.options.getInteger('tier')
        const checkpoints = interaction.options.getInteger('checkpoints')
        const treasurePoints = interaction.options.getInteger('treasurepoints')

        try {
            await MissionHook.create({
                title,
                description,
                dm,
                tier,
                checkpoints,
                treasurePoints
            })
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                console.error(error)
                return interaction.reply('Arrrrrr, that title already exists.')
            }
            console.error(error)
            return interaction.reply('Arrrr, something went wrong!')
        }
        await updateHookChannel(client, hookChannel)

        await interaction.reply({
            content: 'Mission hook created: \n' + hookToString(
                title,
                dm,
                tier,
                checkpoints,
                treasurePoints,
                description
            ),
            ephemeral: true
        })
    }
}
