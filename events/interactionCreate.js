import Interaction from '../app/Interaction.js'

export default {
    name: 'interactionCreate',
    execute (client, interaction) {
        console.log(
            'User triggered interaction',
            Interaction.getInfos(interaction)
        )
    }
}
