'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { Client, Intents } = require('discord.js')
const sinon = require('sinon')
// var sandbox = require("sinon").createSandbox();
const sinonChai = require('sinon-chai')
const Action = require('../../helper/Action')
const Hooks = require('../../helper/HooksHandler')
const MessageFormat = require('../../helper/MessageFormat')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect
const delay = require('delay')

// eslint-disable-next-line no-undef
describe('../../helper/Action', function () {

    beforeEach( function () {
        sinon.spy(console, 'error')
    })

    afterEach( function () {
        sinon.restore()
        // sandbox.restore();
    })

    describe('Action.postHooks', function () {
        // eslint-disable-next-line no-undef
        it('should return embeddedMessage', async function () {
            const HooksStub = sinon.stub(Hooks, 'get')
            // eslint-disable-next-line max-len
            const embedMessageStub = sinon.stub(MessageFormat, 'embedMessageFrom').returns('Bar1\nBar2')
    
            const embeddedMessage = Action.postHooks()
    
            await delay(1000)
            sinon.assert.calledOnce(HooksStub)
            sinon.assert.calledOnce(embedMessageStub)
            expect(embeddedMessage).to.eventually.deep.equal({
                embeds: ['Bar1\nBar2'],
                content: '**Available mission hooks**'
            })
        })
    })

    // // eslint-disable-next-line no-undef
    // describe('Action.updateHookChannel', async function () {
    //     it(
    //         'should run ' +
    //         'channel.bulkDelete + channel.send',
    //         async function () {
    //             // sinon.stub(Client.prototype)
    //             const client = new Client({
    //                 intents: [
    //                     Intents.FLAGS.GUILDS,
    //                 ]
    //             })
    //             const channel = client.channels.cache.get(1234)
    //             // const clientStub = sinon.stub(client, 'channels.cache.get')
    //             // sinon.stub(Client, 'get')

    //             const deleted = sinon.stub(channel, 'bulkDelete').resolves([])
    //             const channelSendStubd = sinon.stub(channel, 'send')
    
    //             expect(Action.updateHookChannel(clientStub, '1234'))
    //                 .to.eventually.not.throw()
                
    //             await delay(1000)
    //             sinon.assert.called(deleted)
    //             sinon.assert.calledOnce(channelSendStubd)
    //         }
    //     )
    // })

    // describe('Action.sendPollVote', async function () {
    //     it(
    //         ' should run ' +
    //         'channel.send + message.react',
    //         async function () {
    //             const messageStub = sinon.stub(channel, 'send').resolves({
    //                 react: 'foo'
    //             })
    //             const reactions = sinon.stub(message, 'react')
    
    //             expect(Action.sendPollVote(['baz', 2], 'foo'))
    //                 .to.eventually.not.throw()
                
    //             await delay(1000)
    //             sinon.assert.calledOnce(messageStub)
    //             sinon.assert.calledTwice(reactions)
    //         }
    //     )

    //     it(
    //         'should run ' +
    //         'should log error', async function () {
    //             sinon.stub(channel, 'send').resolves({
    //                 react: 'foo'
    //             })
    //             // sandbox.stub(message, 'react').throws(new Error('foo'))
    //             sinon.stub(message, 'react').rejects(Error('foo'))
                
    //             Action.sendPollVote(['baz', 2], 'foo')
    
    //             await delay(1000)
    //             expect(console.error).to.have.been.calledWith(
    //                 'One of the emojis failed to react: foo'
    //             )
    //         }
    //     )
    // })
})
