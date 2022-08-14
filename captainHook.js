const fs = require('node:fs')
const path = require('node:path')
const { Client, Collection, GatewayIntentBits } = require('discord.js')
require('log-timestamp')
/* eslint-disable no-unused-vars */
const { token } = require('./config.js')
const Action = require('./app/Action.js')
const Scheduled = require('./app/Scheduled.js')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ],
    allowedMentions: { parse: ['users', 'roles'] }
})

client.once('ready', async () => {
    client.user.setPresence(
        {
            activities: [{ name: 'treasure hunt' }]
        }
    )

    try {
        await Scheduled.postPolls(client)
        await Scheduled.postMessages(client)
    } catch (e) {
        console.error(e)
    }
})

client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    client.commands.set(command.data.name, command)
}

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName)

        if (!command) return

        try {
            await command.execute(interaction, client)
        } catch (error) {
            console.error(error)
            await interaction.reply({
            // eslint-disable-next-line max-len
                content: 'Arrrrr, there was an error while executing this command!',
                ephemeral: true
            })
        }
    }

    if (interaction.isSelectMenu()) {
        const value = interaction.values[0]
        if (interaction.customId === 'hookselect') {
            try {
                await Action.selectHook(
                    interaction,
                    client,
                    value
                )
            } catch (error) {
                console.error(error)
                await interaction.reply({
                // eslint-disable-next-line max-len
                    content: 'Arrrrr, there was an error while executing this command!',
                    ephemeral: true
                })
            }
        }
        if (interaction.customId === 'confirmselect') {
            try {
                await Action.procedeAfterConfirm(
                    interaction,
                    client,
                    value
                )
            } catch (error) {
                console.error(error)
                await interaction.reply({
                // eslint-disable-next-line max-len
                    content: 'Arrrrr, there was an error while executing this command!',
                    ephemeral: true
                })
            }
        }
    }
})

const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = require(filePath)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args))
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args))
    }
}

// Login to Discord with your client's token
client.login(token)
