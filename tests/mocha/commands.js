'use strict'

/* eslint-disable */

const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
const path = require('node:path')
const Action = require('../../helper/Action')
const Hooks = require('../../helper/HooksHandler')
const { interaction, client, channel, missionHookEntry } = require('../config')
const { hookChannel } = require('../../config')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

var commandPath = path.join(__dirname, '../../commands')

describe('../../commands', function () {
    beforeEach( function () {
        sinon.spy(console, 'error')
        sinon.spy(console, 'log')
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
                const pollStub = sinon.stub(Hooks, 'getPoll')
                    .resolves(['foo', 2])
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
                sinon.assert.calledOnceWithExactly(sendVoteStub, 'foo', 2, channel)
        })
    })

    describe('hookdelete', function () {
        it(
            'should call interaction.options.getInteger() + ' + 
            'Hooks.getOne + ' + 
            'Action.updateHookChannel + ' +
            'interaction.reply + ',
            async function () {
                const id = 1
                const command = require(path.join(commandPath, 'hookdelete'))
                sinon.stub(interaction.options, 'getInteger')
                    .returns(id)
                const getStub = sinon.stub(Hooks, 'getOne')
                    .resolves(missionHookEntry)
                const deleteStub = sinon.stub(Hooks, 'delete')
                const updateStub = sinon.stub(Action, 'updateHookChannel')
                const replyStub = sinon.stub(interaction, 'reply')

                await command.execute(interaction, client)

                sinon.assert.calledOnceWithExactly(getStub, id)
                sinon.assert.calledOnceWithExactly(deleteStub, id)
                sinon.assert.calledOnceWithExactly(updateStub, client, hookChannel)
                sinon.assert.calledOnceWithExactly(
                    replyStub,
                    {
                        content: 'Hook with id: ' + id + ' was deleted',
                        ephemeral: true
                    }
                )
        })

        it(
            'should log error on missing id + ' + 
            'interaction.reply error message ',
            async function () {
                const id = 1
                const command = require(path.join(commandPath, 'hookdelete'))
                sinon.stub(interaction.options, 'getInteger')
                    .returns(id)
                sinon.stub(Hooks, 'getOne')
                    .resolves([])
                const replyStub = sinon.stub(interaction, 'reply')

                await command.execute(interaction, client)

                expect(console.log).to.have.been.calledWith(
                    'User requested delete for non-existent', {id}
                )
                sinon.assert.calledOnceWithExactly(
                    replyStub,
                    {
                        content: 'Arrrrr, that id doesn\'t exist',
                        ephemeral: true
                    }
                )
        })

        it(
            'should log error on unknown error + ' + 
            'interaction.reply error message',
            async function () {
                const id = 1
                const error = Error('test error')
                const command = require(path.join(commandPath, 'hookdelete'))
                sinon.stub(interaction.options, 'getInteger')
                    .returns(id)
                sinon.stub(Hooks, 'getOne').throws(error)
                const replyStub = sinon.stub(interaction, 'reply')

                await command.execute(interaction, client)

                expect(console.error).to.have.been.calledWith(
                    'Something went wrong:'
                )
                sinon.assert.calledOnceWithExactly(
                    replyStub,
                    {
                        content: 'Arrrrr, something went wrong!',
                        ephemeral: true
                    }
                )
        })
    })
})