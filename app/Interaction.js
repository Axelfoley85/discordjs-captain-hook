class Interaction {
    static getInfos (interaction) {
        return {
            username: interaction.user.username,
            userId: interaction.user.id,
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            channelName: interaction.channel.name,
            type: interaction.type
        }
    }

    static async postError (interaction) {
        return await interaction.reply({
            content: 'Arrrrr, there was an error while ' +
                'executing this command!',
            ephemeral: true
        })
    }
}

export default Interaction
