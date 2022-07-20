'use strict'

/* eslint-disable */

const sinon = require('sinon')
const { Client, Intents } = require('discord.js')
const Action = require('../../helper/Action')
const Hooks = require('../../helper/HooksHandler')
const MessageFormat = require('../../helper/MessageFormat')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
// var sandbox = require("sinon").createSandbox();
const sinonChai = require('sinon-chai')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

var client = {
    channels: {
        cache: { 
            get: function () {}
        }
    }
}
var channel = {
    bulkDelete: function () {},
    send: function () {}
}
var message = { react: function () {} }

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
                const clientMock = client
                const clientStub = sinon.stub(client.channels.cache, 'get')
                    .returns(channel)
                const deleted = sinon.stub(channel, 'bulkDelete')
                deleted.onCall(0).resolves({ size: 5})
                deleted.onCall(1).resolves({ size: 0})
                const channelSendStubd = sinon.stub(channel, 'send')
    
                await Action.updateHookChannel(client, '1234')
    
                sinon.assert.calledTwice(deleted)
                sinon.assert.calledOnce(channelSendStubd)
            }
        )
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
            }
        )

        it(
            'should run ' +
            'log error', async function () {
                sinon.stub(channel, 'send').resolves(message)
                const exception = Error('foo')
                const reactStub = sinon.stub(message, 'react')
                    .throws(exception)

                await Action.sendPollVote('baz', 2, channel)

                expect(console.error).to.have.been.calledWith(
                    'One of the emojis failed to react:'
                )
            }
        )
    })
})