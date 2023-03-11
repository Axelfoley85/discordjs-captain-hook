'use strict'

/* eslint-disable */

const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
const ClientInstance = require('../../app/ClientInstance')
const { client, interaction, command } = require('../config')
const Scheduled = require('../../app/Scheduled')
const Interaction = require('../../app/Interaction')
const Action = require('../../app/Action')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

describe('app/ClientInstance.js', function () {
    beforeEach(async function () {
        sinon.spy(console, 'error')
        sinon.spy(console, 'log')
    })

    afterEach( function () {
        sinon.restore()
    })

    describe('ClientInstance.init', function () {
        it('should not throw', function () {
            ClientInstance.init()
        })
    })

    describe('ClientInstance.runApp', function () {
        it('should not throw', function () {
            sinon.stub(ClientInstance, 'prepareApp').returns(client)

            ClientInstance.runApp()
        })
    })

    describe('ClientInstance.onceReady', function () {
        it('should not throw', function () {
            const onceStub = sinon.stub(client, 'once')

            ClientInstance.onceReady(client)

            sinon.assert.calledOnce(onceStub)
        })
    })

    describe('ClientInstance.runOnReady', function () {
        it('should not throw', async function () {
            const setPresenceStub = sinon.stub(client.user, 'setPresence')
            const postPollsStub = sinon.stub(Scheduled, 'postPolls').resolves()
            const postMessagesStub = sinon.stub(Scheduled, 'postMessages').resolves()

            await ClientInstance.runOnReady(client)

            sinon.assert.calledOnce(setPresenceStub)
            sinon.assert.calledOnce(postPollsStub)
            sinon.assert.calledOnce(postMessagesStub)
        })
    })

    describe('ClientInstance.setCommands', function () {
        it('should not throw', function () {
            ClientInstance.setCommands(client)
        })
    })

    describe('ClientInstance.parseEvents', function () {
        it('should not throw', function () {
            ClientInstance.parseEvents(client)
        })
    })

    describe('ClientInstance.prepareApp', function () {
        it('should not throw', function () {
            sinon.stub(ClientInstance, 'onInteractionCreate')

            ClientInstance.prepareApp()
        })
    })

    describe('ClientInstance.handleInteraction', function () {
        it('should call handlers', async function () {
            sinon.stub(interaction, 'isChatInputCommand').returns(true)
            sinon.stub(interaction, 'isSelectMenu').returns(true)
            sinon.stub(interaction, 'isButton').returns(true)
            const chatInputStub = sinon.stub(ClientInstance, 'handleChatInputCommand')
            const selectMenuStub = sinon.stub(ClientInstance, 'handleSelectMenuType')
            const ButtonStub = sinon.stub(ClientInstance, 'logButtonInteraction')
            
            await ClientInstance.handleInteraction(client, interaction)

            sinon.assert.calledOnce(chatInputStub)
            sinon.assert.calledOnce(selectMenuStub)
            sinon.assert.calledOnce(ButtonStub)
        })
    })

    describe('ClientInstance.handleChatInputCommand', function () {
        it('should call execute', async function () {
            sinon.stub(client.commands, 'get').returns(command)
            const executeStub = sinon.spy(command, 'execute')
            
            await ClientInstance.handleChatInputCommand(client, interaction)

            sinon.assert.calledOnce(executeStub)
        })

        it('should log and interaction.postError on error', async function () {
            sinon.stub(client.commands, 'get').returns(true)
            sinon.stub(command, 'execute').throws('Foo')
            const posterrorStub = sinon.stub(Interaction, 'postError')
            
            await ClientInstance.handleChatInputCommand(client, interaction)

            sinon.assert.calledOnce(posterrorStub)
            expect(console.error).to.have.been.calledWith(
                'There was an error:'
            )
        })
    })

    describe('ClientInstance.handleSelectMenuType', function () {
        it('hookselect should call selectHook', async function () {
            interaction.customId = 'hookselect'
            const callActionStub = sinon.stub(ClientInstance, 'callAction')
                
            await ClientInstance.handleSelectMenuType(client, interaction)
            
            sinon.assert.calledOnceWithExactly(
                callActionStub,
                client,
                interaction,
                interaction.values[0],
                Action.selectHook
            )
        })

        it('hookselect should call procedeAfterComfirm', async function () {
            interaction.customId = 'confirmselect'
            const callActionStub = sinon.stub(ClientInstance, 'callAction')
                
            await ClientInstance.handleSelectMenuType(client, interaction)
            
            sinon.assert.calledOnceWithExactly(
                callActionStub,
                client,
                interaction,
                interaction.values[0],
                Action.procedeAfterConfirm
            )
        })
    })
    
    describe('ClientInstance.callAction', function () {
        it('should call ActionFunction', async function () {
            const functionStub = sinon.stub(Action, 'procedeAfterConfirm')

            await ClientInstance.callAction(
                client,
                interaction,
                interaction.values[0],
                Action.procedeAfterConfirm
            )

            sinon.assert.calledOnceWithExactly(
                functionStub,
                interaction,
                client,
                interaction.values[0]
            )
        })

        it('should log and interaction.postError on error', async function () {
            sinon.stub(Action, 'procedeAfterConfirm').throws('Foo')
            const posterrorStub = sinon.stub(Interaction, 'postError')

            await ClientInstance.callAction(
                client,
                interaction,
                interaction.values[0],
                Action.procedeAfterConfirm
            )

            sinon.assert.calledOnce(posterrorStub)
            expect(console.error).to.have.been.calledWith(
                'There was an error:'
            )
        })
    })
    
    describe('ClientInstance.logButtonInteraction', function () {
        it('should log interaction.message', async function () {
            const logButtonStub = sinon.spy(ClientInstance, 'logButtonInteraction')

            await ClientInstance.logButtonInteraction(
                client,
                interaction
            )

            sinon.assert.calledOnce(logButtonStub)
            expect(console.log).to.have.been.calledWith({
                content: "This is a message with components.",
                label: "Click me!",
                channelId: "345626669114982402",
                authorName: "Mason",
            })
        })
    })
})
