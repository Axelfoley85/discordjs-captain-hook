'use strict'

const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const HooksHandler = require('./HooksHandler')
const MessageFormat = require('./MessageFormat')
const Interaction = require('./Interaction')
const { hookChannel } = require('../config')
const alphabet = require('../valueObjects/alphabet').alphabet

class Action {
    static async postHooks (info) {
        let allHooks = await HooksHandler.getFullHookDescriptions({
            where: {
                guildId: info.guildId,
                status: 'active'
            }
        })
        if (allHooks === '') { allHooks = 'Nothing here' }

        const embeddedMessage = {
            embeds: [MessageFormat.embedMessageFrom(allHooks)],
            content: '**Available mission hooks**'
        }
        return embeddedMessage
    }

    static async updateHookChannel (client, channelID, info) {
        const channel = client.channels.cache.get(channelID)

        let deleted
        do {
            deleted = await channel.bulkDelete(100)
        } while (deleted.size !== 0)

        await channel.send(await Action.postHooks(info))
    }

    static async postHookVote (content, channel) {
        const title = '**:bar_chart: HOOK! HOOK! HOOK! HOOK! HOOK!**'
        await Action.sendPollToChannel(
            channel,
            title,
            content
        )
    }

    static async sendPollToChannel (channel, title, contentArray) {
        let contentArr = [].concat(contentArray)

        contentArr = MessageFormat.addAlphabetPrefix(contentArr)

        if (contentArr.length === 0) {
            await channel.send({
                embeds: [MessageFormat.embedMessageFrom(
                    'Nothing here'
                )],
                content: title
            })
        } else {
            const message = await channel.send({
                embeds: [MessageFormat.embedMessageFrom(
                    MessageFormat.arrayToText(contentArr)
                )],
                content: title,
                fetchReply: true
            })

            await Action.attachPollEmojis(contentArr, message)
        }
    }

    static async attachPollEmojis (contentArr, message) {
        try {
            for (let i = 0; i < contentArr.length; i++) {
                await message.react(alphabet[i])
            }
        } catch (error) {
            console.error('One of the emojis failed to react:', error)
        }
    }

    static async assignRole (member, user, role) {
        if (member.roles.cache.has(role.id)) {
            console.log(
                `${user.tag}, ` +
                'already has this role!'
            )
        } else {
            try {
                await member.roles.add(role.id)
            } catch (error) {
                console.error('There has been an error assigning roles!', error)
            }

            console.log(
                `The role ${role.name} ` +
                `has been added to ${user.tag}.`
            )
        }
    }

    static async selectHook (interaction, client, deleteId) {
        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('confirmselect')
                    .setPlaceholder('Please confirm')
                    .addOptions(
                        {
                            label: 'I confirm',
                            description: `Confirm hook #${deleteId}`,
                            value: deleteId
                        }
                    )
            )

        await interaction.update({
            content: 'Hook was selected! Please confirm ' +
            'by using the select menu again.',
            components: [row],
            ephemeral: true
        })
    }

    static async procedeAfterConfirm (interaction, client, value) {
        const info = Interaction.getInfos(interaction)
        const [id, type] = value.split(',')
        if (type === 'delete') {
            await HooksHandler.delete(parseInt(id))
        } else if (type === 'hide') {
            await HooksHandler.hide(parseInt(id))
        } else if (type === 'unhide') {
            await HooksHandler.unhide(parseInt(id))
        }
        await Action.updateHookChannel(client, hookChannel, info)

        await interaction.update({
            content: 'Done!' +
                ` See updated list in <#${hookChannel}>`,
            components: [],
            ephemeral: true
        })
    }
}

module.exports = Action
