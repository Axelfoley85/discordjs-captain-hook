'use strict'

/* eslint-disable */

import sinon from 'sinon'
import * as chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'

import Action from '../../app/Action.js'
import HooksHandler from '../../app/HooksHandler.js'
import MessageFormat from '../../app/MessageFormat.js'
import Interaction from '../../app/Interaction.js'
// import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js'

import { config } from '../../config.js'
const { hookChannel } = config

import { mock } from '../config.js'
const { message, channel, client, member, author, interaction, hook } = mock

import { westMarchesRole } from '../../valueObjects/roles.js'
import db from '../../models/index.js'

chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

describe('app/Action', function () {

    beforeEach( async function () {
        sinon.spy(console, 'error')
        sinon.spy(console, 'log')
        await db.missionHooks.sync({
            force: true
        })
        await db.missionHooks.create(hook.dbEntry())
    })

    afterEach( function () {
        sinon.restore()
    })

    describe('Action.postHooks', function () {
        it('should return embeddedMessage', async function () {
            const info = Interaction.getInfos(interaction)
            const HooksStub = sinon.stub(HooksHandler, 'getFullHookDescriptions').resolves('foo')
            const embedMessageStub = sinon
                .stub(MessageFormat, 'embedMessageFrom')
                .returns('Bar1\nBar2')
            const expectedEmbedMessage = {
                embeds: ['Bar1\nBar2'],
                content: '**Available mission hooks**'
            }

            const embeddedMessage = await Action.postHooks(info)

            sinon.assert.calledOnce(HooksStub)
            sinon.assert.calledOnce(embedMessageStub)
            sinon.assert.match(embeddedMessage, expectedEmbedMessage)
        })
    })

    describe('Action.updateHookChannel', async function () {
        it(
            'should run ' +
            'channel.bulkDelete + channel.send',
        async function () {
            const info = Interaction.getInfos(interaction)
            const postHooksStub = sinon.stub(Action, 'postHooks')
            sinon.stub(client.channels.cache, 'get')
                .returns(channel)
            const deleted = sinon.stub(channel, 'bulkDelete')
            deleted.onCall(0).resolves({ size: 5})
            deleted.onCall(1).resolves({ size: 0})
            const channelSendStubd = sinon.stub(channel, 'send')

            await Action.updateHookChannel(client, '1234', info)

            sinon.assert.calledTwice(deleted)
            sinon.assert.calledOnce(channelSendStubd)
            sinon.assert.calledOnce(postHooksStub)
        })
    })

    describe('Action.postHookVote', async function () {
        it(
            ' should run Action.sendPollToChannel',
        async function () {
            const sendStub = sinon.stub(Action, 'sendPollToChannel')

            await Action.postHookVote(['baz'], channel)

            sinon.assert.calledOnceWithExactly(
                sendStub,
                channel,
                '**:bar_chart: HOOK! HOOK! HOOK! HOOK! HOOK!**',
                ['baz']
            )
        })
    })

    describe('Action.sendPollToChannel', async function () {
        it(
            ' should run ' +
            'channel.send + message.react',
        async function () {
            const sendStub = sinon.stub(channel, 'send')
                .resolves(message)
            const reactions = sinon.stub(Action, 'attachPollEmojis')

            await Action.sendPollToChannel(channel, 'this is a title', ['foo', 'bar'])

            sinon.assert.calledOnce(sendStub)
            sinon.assert.calledOnce(reactions)
        })

        it(
            ' should run ' +
            'channel.send when array empty',
        async function () {
            const sendStub = sinon.stub(channel, 'send')
                .resolves(message)
            const reactions = sinon.stub(Action, 'attachPollEmojis')

            await Action.sendPollToChannel(channel, 'this is a title', [])

            sinon.assert.calledOnce(sendStub)
            sinon.assert.notCalled(reactions)
        })
    })

    describe('Action.attachPollEmojis', async function () {
        it(
            ' should run ' +
            'channel.send + message.react',
        async function () {
            const reactions = sinon.stub(message, 'react')

            await Action.attachPollEmojis(['foo', 'bar'], message)

            sinon.assert.callCount(reactions, 2)
        })

        it('should run log error', async function () {
            const reactStub = sinon.stub(message, 'react')
                .throws(Error('fooError'))

            await Action.attachPollEmojis(['foo', 'bar'], message)

            expect(console.error).to.have.been.calledWith(
                'One of the emojis failed to react:'
            )
        })
    })

    describe('Action.assignRole', async function () {
        it(
            'should run ' +
            'Action.assignRole',
        async function () {
            const hasStub = sinon.stub(member.roles.cache, 'has')
                .returns(false)
            const addStub = sinon.stub(member.roles, 'add').resolves()

            await Action.assignRole(member, author, westMarchesRole)

            sinon.assert.calledOnceWithExactly(addStub, westMarchesRole.id)
            expect(console.log).to.have.been.calledWith(
                `The role WestMarches ` +
                `has been added to ${author.tag}.`
            )
        })

        it(
            'log that role exists already',
        async function () {
            const hasStub = sinon.stub(member.roles.cache, 'has')
                .returns(true)

            await Action.assignRole(member, author, westMarchesRole)

            expect(console.log).to.have.been.calledWith(
                'authorName, already has this role!'
            )
        })

        it(
            'log thrown errors',
        async function () {
            const hasStub = sinon.stub(member.roles.cache, 'has')
                .returns(false)
            const addStub = sinon.stub(member.roles, 'add')
                .throws(Error('foo'))

            await Action.assignRole(member, author, westMarchesRole)

            expect(console.error).to.have.been.calledWith(
                'There has been an error assigning roles!'
            )
        })
    })

    describe('Action.procedeAfterConfirm', function () {
        it(
            'should call HooksHandler.delete' +
            'Action.updateHookChannel + ' +
            'interaction.update',
        async function () {
            const id = 1
            const value = `${id},delete`
            const deleteStub = sinon.spy(HooksHandler, 'delete')
            const updateStub = sinon.stub(Action, 'updateHookChannel')
            const replyStub = sinon.stub(interaction, 'update')

            await Action.procedeAfterConfirm(interaction, client, value)

            sinon.assert.calledOnceWithExactly(deleteStub, id)
            sinon.assert.calledOnceWithExactly(
                updateStub,
                client,
                hookChannel,
                Interaction.getInfos(interaction)
            )
            sinon.assert.calledOnceWithExactly(
                replyStub,
                {
                    content: 'Done! See updated list in <#0000>',
                    components: [],
                    ephemeral: true
                }
            )
        })

        it('should call HooksHandler.hide', async function () {
            const id = 1
            const value = `${id},hide`
            const hideStub = sinon.stub(HooksHandler, 'hide')
            sinon.stub(Action, 'updateHookChannel')
            sinon.stub(interaction, 'update')

            await Action.procedeAfterConfirm(interaction, client, value)

            sinon.assert.calledOnceWithExactly(hideStub, id)
        })

        it('should call HooksHandler.unhide', async function () {
            const id = 1
            const value = `${id},unhide`
            const unhideStub = sinon.stub(HooksHandler, 'unhide')
            sinon.stub(Action, 'updateHookChannel')
            sinon.stub(interaction, 'update')

            await Action.procedeAfterConfirm(interaction, client, value)

            sinon.assert.calledOnceWithExactly(unhideStub, id)
        })
    })

    // // // THIS REALLY SHOULD WORK BUT DOESNT
    // describe('Action.selectHook', function () {
    //     it(' should run interaction.update', async function () {
    //         const updateStub = sinon.stub(interaction, 'update')
    //             .resolves()
    //         sinon.spy(function () {
    //             return sinon.createStubInstance(ActionRowBuilder)
    //         })
    //         sinon.spy(function () {
    //             return sinon.createStubInstance(StringSelectMenuBuilder)
    //         })

    //         await Action.selectHook(interaction, client, 1)

    //         sinon.assert.calledOnceWithMatch(
    //             updateStub,
    //             {
    //                 content: 'Hook was selected! Please confirm ' +
    //                     'by using the select menu again.'
    //             }
    //         )
    //     })
    // })
})
