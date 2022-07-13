const { SlashCommandBuilder } = require('@discordjs/builders')
const Hooks = require('../helper/HooksHandler')
const { hookChannel } = require('../config.js')
const { updateHookChannel } = require('../helper/Action')

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
            const response = await Hooks.getOne(id)
            if (typeof response[0] === 'undefined') {
                return interaction.reply({
                    content: 'Arrrrr, that id doesn\'t exist',
                    ephemeral: true
                })
            }
            await Hooks.delete(id)
        } catch (error) {
            console.error(error)
            return interaction.reply({
                content: 'Arrrrr, something went wrong!',
                ephemeral: true
            })
        }
        await updateHookChannel(client, hookChannel)

        await interaction.reply({
            content: 'Hook with id: ' + id + ' was deleted',
            ephemeral: true
        })
    }
}
