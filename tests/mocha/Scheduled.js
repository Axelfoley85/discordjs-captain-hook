'use strict'

/* eslint-disable */

import sinon from 'sinon'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
import Scheduled from '../../app/Scheduled.js'
import Action from '../../app/Action.js'
import HooksHandler from '../../app/HooksHandler.js'

import { mock } from '../config.js'
const { client, channel, scheduledPolls, scheduledMessages } = mock

chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect


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
