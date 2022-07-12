const { SlashCommandBuilder } = require('@discordjs/builders')
const Action = require('../helper/Action')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hooksshowall')
        .setDescription('list all mission hooks'),
    async execute (interaction) {
        await interaction.reply(await Action.post_hooks())
    }
}
