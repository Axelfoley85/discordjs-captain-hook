'use strict'

/* eslint-disable */

const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
const path = require('node:path')
const Action = require('../../helper/Action')
const { updateHookChannel } = require('../../helper/Action')
const Hooks = require('../../helper/HooksHandler')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

var commandPath = path.join(__dirname, '../../commands')

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
var interaction = { reply: function () {} }

describe('../../commands', function () {
    beforeEach( function () {
        sinon.spy(console, 'error')
    })

    afterEach( function () {
        sinon.restore()
    })

    describe('updatehookchannel', function () {
        it(
            'should call updateHookChannel' + 
            'post reply',
            async function () {
                const command = require(path.join(commandPath, 'updatehookchannel'))
                const updateStub = sinon.stub(Action, 'updateHookChannel')
                const replyStub = sinon.stub(interaction, 'reply')

                await command.execute(interaction, client)

                sinon.assert.calledOnce(updateStub)
                sinon.assert.calledOnceWithExactly(replyStub, '**Mission hooks updated successfull**')
        })
    })

    describe('hookpoll', function () {
        it(
            'should call Hooks.getPoll + ' + 
            'interaction.reply' + 
            'sendPollVote',
            async function () {
                const command = require(path.join(commandPath, 'hookpoll'))
                sinon.stub(client.channels.cache, 'get')
                    .returns(channel)
                const pollStub = sinon.stub(Hooks, 'getPoll').resolves('foo')
                const replyStub = sinon.stub(interaction, 'reply')
                const sendVoteStub = sinon.stub(Action, 'sendPollVote')

                await command.execute(interaction, client)

                sinon.assert.calledOnce(pollStub)
                sinon.assert.calledOnce(replyStub)
                sinon.assert.calledOnceWithExactly(
                    replyStub,
                    {
                        content: 'Vote has been posted in <#[object Object]>',
                        ephemeral: true
                    }
                )
                sinon.assert.calledOnce(sendVoteStub)
        })
    })
})