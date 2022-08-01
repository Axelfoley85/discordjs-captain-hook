const { SlashCommandBuilder } = require('discord.js')
// const MissionHooks = require('../models/MissionHooks.js')
const { hookChannel } = require('../config.js')
const Action = require('../helper/Action.js')
const db = require('../models/index.js')
const Hook = require('../valueObjects/hook.js')

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
        const hook = new Hook(
            interaction.options.getString('title'),
            interaction.options.getString('dm'),
            interaction.options.getInteger('tier'),
            interaction.options.getInteger('checkpoints'),
            interaction.options.getString('description')
        )

        try {
            await db.missionHooks.create(hook.get())
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
            content: 'Mission hook created: \n' + hook.toString(),
            ephemeral: true
        })
    }
}
