const fs = require('node:fs')
const path = require('node:path')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const Scheduled = require('./Scheduled')
const Action = require('./Action')
const { token } = require('../config')
const Interaction = require('./Interaction')

class ClientInstance {
    static init () {
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

        return client
    }

    static onceReady (client) {
        client.once('ready', async () => {
            await ClientInstance.runOnReady(client)
        })
    }

    static async runOnReady (client) {
        client.user.setPresence(
            {
                activities: [{ name: 'treasure hunt' }]
            }
        )

        try {
            await Scheduled.postPolls(client)
            await Scheduled.postMessages(client)
        } catch (e) {
            console.error('There was an error:', e)
        }
    }

    static getFolder (folderName) {
        const folderPath = path.join(__dirname, '../', folderName)
        const folderFiles = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith('.js'))
        return [folderFiles, folderPath]
    }

    static setCommands (client) {
        client.commands = new Collection()
        const [
            commandFiles,
            commandsPath
        ] = ClientInstance.getFolder('commands')

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const command = require(filePath)
            client.commands.set(command.data.name, command)
        }
    }

    static parseEvents (client) {
        const [
            eventFiles,
            eventsPath
        ] = ClientInstance.getFolder('events')

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file)
            const event = require(filePath)
            if (event.once) {
                client.once(event.name, (...args) => event.execute(
                    client,
                    ...args
                ))
            } else {
                client.on(event.name, (...args) => event.execute(
                    client,
                    ...args
                ))
            }
        }
    }

    static onInteractionCreate (client) {
        client.on('interactionCreate', async interaction => {
            await ClientInstance.handleInteraction(client, interaction)
        })
    }

    static async handleInteraction (client, interaction) {
        if (interaction.isChatInputCommand()) {
            await ClientInstance.handleChatInputCommand(client, interaction)
        }

        if (interaction.isSelectMenu()) {
            await ClientInstance.handleSelectMenuType(client, interaction)
        }
    }

    static async handleChatInputCommand (client, interaction) {
        const command = client.commands.get(interaction.commandName)

        if (!command) return

        try {
            await command.execute(interaction, client)
        } catch (error) {
            console.error('There was an error:', error)
            await Interaction.postError(interaction)
        }
    }

    static async handleSelectMenuType (client, interaction) {
        const value = interaction.values[0]
        if (interaction.customId === 'hookselect') {
            ClientInstance.callAction(
                client, interaction, value, Action.selectHook
            )
        }
        if (interaction.customId === 'confirmselect') {
            ClientInstance.callAction(
                client, interaction, value, Action.procedeAfterConfirm
            )
        }
    }

    static async callAction (client, interaction, value, actionFunction) {
        try {
            await actionFunction(
                interaction,
                client,
                value
            )
        } catch (error) {
            console.error('There was an error:', error)
            await Interaction.postError(interaction)
        }
    }

    static prepareApp () {
        const client = ClientInstance.init()
        ClientInstance.onceReady(client)
        ClientInstance.setCommands(client)
        ClientInstance.parseEvents(client)
        ClientInstance.onInteractionCreate(client)

        return client
    }

    static runApp () {
        const client = ClientInstance.prepareApp()
        client.login(token)
    }
}

module.exports = ClientInstance