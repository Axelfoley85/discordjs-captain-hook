const Interaction = require('../app/Interaction')

module.exports = {
    name: 'interactionCreate',
    execute (client, interaction) {
        console.log(
            'User triggered interaction',
            Interaction.getInfos(interaction)
        )
    }
}
