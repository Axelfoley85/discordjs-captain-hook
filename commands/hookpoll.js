const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const Hooks = require('../helper/HooksHandler')
const { alphabet } = require('../models/valueObjects')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hookpoll')
        .setDescription('make poll for next mission hooks'),
    async execute (interaction) {
        const response = await Hooks.getPoll()

        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(response[0])
        const message = await interaction.reply({
            embeds: [embed],
            content: '**:bar_chart: Arrrrrr, which Hook next?**',
            fetchReply: true
        })

        try {
            for (let i = 0; i < response[1]; i++) {
                await message.react(alphabet[i])
            }
        } catch (error) {
            console.error('One of the emojis failed to react:', error)
        }
    }
}
