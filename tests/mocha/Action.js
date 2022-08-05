'use strict'

/* eslint-disable */

const sinon = require('sinon')
const Action = require('../../helper/Action')
const HooksHandler = require('../../helper/HooksHandler')
const MessageFormat = require('../../helper/MessageFormat')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
const { message, channel, client, scheduledPolls, scheduledMessages, member, author, interaction } = require('../config')
const { hookChannel } = require('../../config')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

let clock

describe('../../helper/Action', function () {

    beforeEach( function () {
        sinon.spy(console, 'error')
        sinon.spy(console, 'log')
        clock = sinon.useFakeTimers()
    })

    afterEach( function () {
        sinon.restore()
        clock.restore();
    })

    describe('Action.postHooks', function () {
        it('should return embeddedMessage', async function () {
            const HooksStub = sinon.stub(HooksHandler, 'getFullHookDescriptions').resolves('foo')
            const embedMessageStub = sinon
                .stub(MessageFormat, 'embedMessageFrom')
                .returns('Bar1\nBar2')
            const expectedEmbedMessage = {
                embeds: ['Bar1\nBar2'],
                content: '**Available mission hooks**'
            }

            const embeddedMessage = await Action.postHooks()

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
            const postHooksStub = sinon.stub(Action, 'postHooks')
            sinon.stub(client.channels.cache, 'get')
                .returns(channel)
            const deleted = sinon.stub(channel, 'bulkDelete')
            deleted.onCall(0).resolves({ size: 5})
            deleted.onCall(1).resolves({ size: 0})
            const channelSendStubd = sinon.stub(channel, 'send')

            await Action.updateHookChannel(client, '1234')

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
            const reactions = sinon.stub(message, 'react')

            await Action.sendPollToChannel(channel, 'this is a title', ['foo', 'bar'])

            sinon.assert.calledOnce(sendStub)
            sinon.assert.callCount(reactions, 2)
        })

        it('should run log error', async function () {
            sinon.stub(channel, 'send').resolves(message)
            const reactStub = sinon.stub(message, 'react')
                .throws(Error('fooError'))

            await Action.sendPollToChannel(channel, 'this is a title', ['foo', 'bar'])

            expect(console.error).to.have.been.calledWith(
                'One of the emojis failed to react:'
            )
        })
    })

    describe('Action.postPolls', async function () {
        it(
            'should run ' +
            'cron + Action.sendPollToChannel',
        async function () {
            const sendStub = sinon.stub(Action, 'sendPollToChannel').resolves()

            await Action.postPolls(client, scheduledPolls)
            await clock.tickAsync(2150)

            sinon.assert.calledWith(sendStub)
        })
    })

    describe('Action.postMessages', async function () {
        it(
            'should run ' +
            'cron + channel.send',
        async function () {
            sinon.stub(client.channels.cache, 'get').returns(channel)
            const sendStub = sinon.stub(channel, 'send').resolves()

            await Action.postMessages(client, scheduledMessages)
            await clock.tickAsync(2150)

            sinon.assert.calledWith(sendStub, {
                content: 'message'
            })
        })
    })

    describe('Action.assignRole', async function () {
        it(
            'should run ' +
            'Action.assignRole',
        async function () {
            const role = { id: 10, name: 'foobar'}
            const hasStub = sinon.stub(member.roles.cache, 'has')
                .returns(false)
            const addStub = sinon.stub(member.roles, 'add').resolves()

            await Action.assignRole(member, author, role)

            sinon.assert.calledOnceWithExactly(addStub, role.id)
            expect(console.log).to.have.been.calledWith(
                `The role ${role.name} ` +
                `has been added to ${author.tag}.`
            )
        })

        it(
            'log that role exists already',
        async function () {
            const role = { id: 10, name: 'foobar'}
            const hasStub = sinon.stub(member.roles.cache, 'has')
                .returns(true)

            await Action.assignRole(member, author, role)
            
            expect(console.log).to.have.been.calledWith(
                'authorName, already has this role!'
            )
        })

        it(
            'log thrown errors',
        async function () {
            const role = { id: 10, name: 'foobar'}
            const hasStub = sinon.stub(member.roles.cache, 'has')
                .returns(false)
            const addStub = sinon.stub(member.roles, 'add')
                .throws(Error('foo'))

            await Action.assignRole(member, author, role)

            expect(console.error).to.have.been.calledWith(
                'There has been an error assigning roles!'
            )
        })
    })

    describe('Action.hookdelete', function () {
        it(
            'should call HooksHandler.delete' +
            'Action.updateHookChannel + ' +
            'interaction.followUp',
        async function () {
            const id = 1
            sinon.stub(interaction, 'update').resolves()
            const deleteStub = sinon.stub(HooksHandler, 'delete')
            const updateStub = sinon.stub(Action, 'updateHookChannel')
            const replyStub = sinon.stub(interaction, 'followUp')

            await Action.deleteHookFromSelect(interaction, client)

            sinon.assert.calledOnceWithExactly(deleteStub, id)
            sinon.assert.calledOnceWithExactly(updateStub, client, hookChannel)
            sinon.assert.calledOnceWithExactly(
                replyStub,
                {
                    content: `Hook with id: ${id} was deleted. See updated list in <#0000>`,
                    ephemeral: true
                }
            )
        })
    })
})
