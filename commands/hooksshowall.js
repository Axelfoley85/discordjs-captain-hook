const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const Action = require('../helper/Action')
const Hooks = require('../helper/HooksHandler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hooksshowall')
        .setDescription('list all mission hooks'),
    async execute (interaction) {
        await interaction.reply(await Action.post_hooks())
    }
}
