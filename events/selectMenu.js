const Interaction = require('../app/Interaction')

module.exports = {
    name: 'isSelectMenu',
    execute (client, interaction) {
        console.log(
            'User triggered select menu',
            Interaction.getInfos(interaction)
        )
    }
}
