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
}

module.exports = Interaction
