const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Hooks = require('../helper/HooksHandler');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('showhooks')
        .setDescription('list all mission hooks'),
    async execute(interaction) {
        let response = await Hooks.get()

        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(response);
        const message = await interaction.reply({
            embeds: [embed],
            content: '**Available mission hooks**',
        });
    },
};
