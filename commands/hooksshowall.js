const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const Hooks = require('../helper/HooksHandler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hooksshowall')
        .setDescription('list all mission hooks'),
    async execute (interaction) {
        const response = await Hooks.get()

        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(response)
        await interaction.reply({
            embeds: [embed],
            content: '**Available mission hooks**'
        })
    }
}
