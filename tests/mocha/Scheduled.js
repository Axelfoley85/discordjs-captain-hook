'use strict'

/* eslint-disable */

const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiAsPromised = import('chai-as-promised'); // Dynamic import
chaiAsPromised.then(module => {
    chai.use(module.default);
});
chai.use(sinonChai)
const expect = chai.expect

const { channel, client, scheduledPolls, scheduledMessages } = require('../config')
const Scheduled = require('../../app/Scheduled')
const Action = require('../../app/Action')
const HooksHandler = require('../../app/HooksHandler')

let clock

describe('../../app/Scheduled', function () {

    beforeEach( function () {
        sinon.spy(console, 'error')
        sinon.spy(console, 'log')
        clock = sinon.useFakeTimers()
    })

    afterEach( function () {
        sinon.restore()
        clock.restore()
    })

    describe('Scheduled.postPolls', async function () {
        it(
            'should run ' +
            'cron + Scheduled.sendPollToChannel',
        async function () {
            const sendStub = sinon.stub(Action, 'sendPollToChannel').resolves()

            await Scheduled.postPolls(client, scheduledPolls)
            await clock.tickAsync(2150)

            sinon.assert.calledWith(sendStub)
        })
    })

    describe('Scheduled.postMessages', async function () {
        it(
            'should run ' +
            'cron + channel.send',
        async function () {
            sinon.stub(client.channels.cache, 'get').returns(channel)
            const sendStub = sinon.stub(channel, 'send').resolves()
            const postStub = sinon.stub(Action, 'postHookVote')
            const pollLinesStub = sinon.stub(HooksHandler, 'getHookPollLines')

            await Scheduled.postMessages(client, scheduledMessages)
            await clock.tickAsync(1150)

            expect(console.log).to.be.calledWith(
                'Posting custom scheduled poll'
            )
            await clock.tickAsync(1150)

            sinon.assert.calledTwice(postStub)
            sinon.assert.calledWithExactly(pollLinesStub, {
                guildId: '966698643572809800'
            })
            sinon.assert.calledWithExactly(sendStub, {
                content: 'message'
            })
        })
    })
})
