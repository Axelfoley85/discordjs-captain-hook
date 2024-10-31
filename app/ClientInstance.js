import fs from 'node:fs'
import path from 'node:path'
import {
    Client,
    GatewayIntentBits,
    Collection,
    InteractionType,
    ComponentType
} from 'discord.js'
import Scheduled from './Scheduled.js'
import Action from './Action.js'
import { config } from '../config.js'
import Interaction from './Interaction.js'
const { token } = config

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
        const folderPath = path.join(
            path.dirname(
                new URL(import.meta.url).pathname
            ), '../', folderName
        )
        const folderFiles = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith('.js'))
        return [folderFiles, folderPath]
    }

    static async setCommands (client) {
        client.commands = new Collection()
        const [
            commandFiles,
            commandsPath
        ] = ClientInstance.getFolder('commands')

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const commandModule = await import(filePath)
            const command = commandModule.default
            client.commands.set(command.data.name, command)
        }
    }

    static async parseEvents (client) {
        const [
            eventFiles,
            eventsPath
        ] = ClientInstance.getFolder('events')

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file)
            const eventModule = await import(filePath)
            const event = eventModule.default
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

        if (interaction.type === InteractionType.MessageComponent) {
            console.log('Somebody used a message component!')
            if (interaction.componentType === ComponentType.Button) {
                console.log('Somebody used a button!')
                await ClientInstance.logButtonInteraction(client, interaction)
            }
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
        const { customId, values } = interaction

        const action = customId === 'hookselect'
            ? Action.selectHook
            : customId === 'confirmselect'
                ? Action.procedeAfterConfirm
                : null

        if (action) {
            ClientInstance.callAction(
                client, interaction, values[0], action
            )
        }
    }

    static async logButtonInteraction (client, interaction) {
        const message = interaction.message

        console.log({
            content: message.content,
            label: message.components[0].components[0].label,
            channelId: message.channel_id,
            authorName: message.author.username
        })
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

export default ClientInstance
