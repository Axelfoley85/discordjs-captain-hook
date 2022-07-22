'use strict'

/* eslint-disable */

const sinon = require('sinon')
const Action = require('../../helper/Action')
const Hooks = require('../../helper/HooksHandler')
const MessageFormat = require('../../helper/MessageFormat')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
const { message, channel, client } = require('../config')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

describe('../../helper/Action', function () {

    beforeEach( function () {
        sinon.spy(console, 'error')
    })

    afterEach( function () {
        sinon.restore()
    })

    describe('Action.postHooks', function () {
        it('should return embeddedMessage', async function () {
            const HooksStub = sinon.stub(Hooks, 'get').resolves('foo')
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

    describe('Action.sendPollVote', async function () {
        it(
            ' should run ' +
            'channel.send + message.react',
        async function () {
            const hookCount = 5
            const sendStub = sinon.stub(channel, 'send')
                .resolves(message)
            const reactions = sinon.stub(message, 'react')

            await Action.sendPollVote('baz', hookCount, channel)

            sinon.assert.calledOnce(sendStub)
            sinon.assert.callCount(reactions, hookCount)
        })

        it('should run log error', async function () {
            sinon.stub(channel, 'send').resolves(message)
            const reactStub = sinon.stub(message, 'react')
                .throws(Error('foo'))

            await Action.sendPollVote('baz', 2, channel)

            expect(console.error).to.have.been.calledWith(
                'One of the emojis failed to react:'
            )
        })
    })
})
