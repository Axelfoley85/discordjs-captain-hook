'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
// const { Client, Intents } = require('discord.js')
const sinon = require('sinon')
var sandbox = require("sinon").createSandbox();
const sinonChai = require('sinon-chai')
const Action = require('../../helper/Action')
const Hooks = require('../../helper/HooksHandler')
const MessageFormat = require('../../helper/MessageFormat')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

// eslint-disable-next-line no-undef
describe('../../helper/Action', () => {
    let clientStub
    let channel
    let message
    class Client {
        channels = {
            cache: {
                get () {
                    return {
                        bulkDelete: async function (count) {},
                        send () { }
                    }
                }
            }
        }
    }

    beforeEach(function() {
        sinon.spy(console, 'error')
    })

    afterEach(() => {
        sinon.restore()
        clientStub = new Client()
        channel = clientStub.channels.cache.get()
        message = { react: 'function'}
        sandbox.restore();
    })

    // eslint-disable-next-line no-undef
    it('Action.postHooks should return embeddedMessage', async () => {
        const HooksStub = sinon.stub(Hooks, 'get')
        // eslint-disable-next-line max-len
        const embedMessageStub = sinon.stub(MessageFormat, 'embedMessageFrom').returns('Bar1\nBar2')

        const embeddedMessage = await Action.postHooks()

        sinon.assert.calledOnce(HooksStub)
        sinon.assert.calledOnce(embedMessageStub)
        expect(embeddedMessage).to.deep.equal({
            embeds: ['Bar1\nBar2'],
            content: '**Available mission hooks**'
        })
    })

    // eslint-disable-next-line no-undef
    it(
        'Action.updateHookChannel should run ' +
        'channel.bulkDelete + channel.send',
        function (done) {
            const deleted = sinon.stub(channel, 'bulkDelete').resolves([])
            const channelSendStubd = sinon.stub(channel, 'send')

            expect(Action.updateHookChannel(clientStub, '1234'))
                .to.eventually.not.throw()
            done()

            sinon.assert.called(deleted)
            sinon.assert.calledOnce(channelSendStubd)
        }
    )

    it(
        'Action.sendPollVote should run ' +
        'channel.send + message.react',
        function (done) {
            const messageStub = sinon.stub(channel, 'send').resolves({
                react: 'foo'
            })
            const reactions = sinon.stub(message, 'react')

            // expect(Action.sendPollVote(['baz', 2], 'foo'))
            //     .to.eventually.not.throw()
            done()

            sinon.assert.calledOnce(messageStub)
            sinon.assert.calledTwice(reactions)
        }
    )

    it(
        'Action.sendPollVote should run ' +
        'should log error',
        function (done) {
            sinon.stub(channel, 'send').resolves({
                react: 'foo'
            })
            sandbox.stub(message, 'react').throws(new Error('foo'))
            Action.sendPollVote(['baz', 2], 'foo')
            done()
            
            expect(console.error).to.have.been.calledWith('foo')
        }
    )
})
