const { SlashCommandBuilder } = require('discord.js')
const HooksHandler = require('../helper/HooksHandler')
const { hookChannel } = require('../config.js')
const Action = require('../helper/Action')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hookdelete')
        .setDescription('delete single hook by id')
        .addIntegerOption(
            option => option
                .setName('id')
                .setDescription('hook id')
                .setRequired(true)),
    async execute (interaction, client) {
        const id = interaction.options.getInteger('id')
        try {
            const response = await HooksHandler.getOne(id)
            if (typeof response[0] === 'undefined') {
                console.log('User requested delete for non-existent', {
                    id
                })
                return interaction.reply({
                    content: 'Arrrrr, that id doesn\'t exist',
                    ephemeral: true
                })
            }
            await HooksHandler.delete(id)
        } catch (error) {
            console.error('Something went wrong:', error)
            return interaction.reply({
                content: 'Arrrrr, something went wrong!',
                ephemeral: true
            })
        }
        await Action.updateHookChannel(client, hookChannel)

        await interaction.reply({
            content: 'Hook with id: ' + id + ' was deleted',
            ephemeral: true
        })
    }
}
