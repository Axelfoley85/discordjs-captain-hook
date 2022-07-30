'use strict'

/* eslint-disable */

const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
const path = require('node:path')
const Action = require('../../helper/Action')
const HooksHandler = require('../../helper/HooksHandler')
const { interaction, client, channel, missionHookEntry } = require('../config')
const { hookChannel } = require('../../config')
const db = require('../../models')

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
            sinon.assert.calledOnceWithExactly(
                replyStub,
                '**Mission hooks updated successfull** in <#0000>'
            )
        })
    })

    describe('hookpoll', function () {
        it(
            'should call HooksHandler.getHookPollLines + ' + 
            'interaction.reply' + 
            'postHookVote',
        async function () {
            const command = require(path.join(commandPath, 'hookpoll'))
            sinon.stub(client.channels.cache, 'get')
                .returns(channel)
            const pollStub = sinon.stub(HooksHandler, 'getHookPollLines')
                .resolves(['foo'])
            const replyStub = sinon.stub(interaction, 'reply')
            const sendVoteStub = sinon.stub(Action, 'postHookVote')

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
            sinon.assert.calledOnceWithExactly(sendVoteStub, ['foo'], channel)
        })
    })

    describe('hookdelete', function () {
        it(
            'should call interaction.options.getInteger() + ' + 
            'HooksHandler.getOne + ' + 
            'Action.updateHookChannel + ' +
            'interaction.reply + ',
        async function () {
            const id = 1
            const command = require(path.join(commandPath, 'hookdelete'))
            sinon.stub(interaction.options, 'getInteger')
                .returns(id)
            const getStub = sinon.stub(HooksHandler, 'getOne')
                .resolves(missionHookEntry)
            const deleteStub = sinon.stub(HooksHandler, 'delete')
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
            sinon.stub(HooksHandler, 'getOne')
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
            sinon.stub(HooksHandler, 'getOne').throws(error)
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

    describe('hookadd', function () {
        it(
            'should call MissionHooks.create + ' + 
            'Action.updateHookChannel + ' +
            'interaction.reply + ',
        async function () {
            const command = require(path.join(commandPath, 'hookadd'))
            sinon.stub(interaction.options, 'getString')
                .onCall(0)
                .returns('title')
                .onCall(1)
                .returns('descr')
                .onCall(2)
                .returns('dm')
            sinon.stub(interaction.options, 'getInteger')
                .onCall(0)
                .returns(1)
                .onCall(1)
                .returns(2)
                .onCall(2)
                .returns(3)
            const createStub = sinon.stub(db.missionHooks, 'create')
            const updateStub = sinon.stub(Action, 'updateHookChannel')
            const replyStub = sinon.stub(interaction, 'reply')

            await command.execute(interaction, client)

            sinon.assert.calledOnceWithExactly(
                createStub,
                {
                    title: 'title',
                    description: 'descr',
                    dm: 'dm',
                    tier: 1,
                    checkpoints: 2
                }
            )
            sinon.assert.calledOnceWithExactly(updateStub, client, hookChannel)
            sinon.assert.calledOnceWithExactly(
                replyStub,
                {
                    content: 'Mission hook created: \n' +
                        '**title**\n' +
                        '*dm, tier 1 - 2 checkpoints*\n' +
                        'descr',
                    ephemeral: true
                    }
            )
        })

        it(
            'should log and reply error on already existing hook title',
        async function () {
            class SequelizeUniqueConstraintError extends Error {
                constructor(message) {
                    super(message)

                    this.name = this.constructor.name
                }
            }
            const command = require(path.join(commandPath, 'hookadd'))
            sinon.stub(interaction.options, 'getString')
            sinon.stub(interaction.options, 'getInteger')
            const createStub = sinon.stub(db.missionHooks, 'create')
                .throws(new SequelizeUniqueConstraintError())
            const replyStub = sinon.stub(interaction, 'reply')

            await command.execute(interaction, client)

            sinon.assert.calledOnce(createStub)
            expect(console.error).to.have.been.calledWith(
                'Hook title already exists:'
            )
            sinon.assert.calledOnceWithExactly(
                replyStub,
                {
                    content: 'Arrrrrr, that title already exists.',
                    ephemeral: true
                }
            )
        })

        it(
            'should log and reply error on error',
        async function () {
            const command = require(path.join(commandPath, 'hookadd'))
            sinon.stub(interaction.options, 'getString')
            sinon.stub(interaction.options, 'getInteger')
            const createStub = sinon.stub(db.missionHooks, 'create')
                .throws(Error())
            const replyStub = sinon.stub(interaction, 'reply')

            await command.execute(interaction, client)

            sinon.assert.calledOnce(createStub)
            expect(console.error).to.have.been.calledWith(
                'Something went wrong!'
            )
            sinon.assert.calledOnceWithExactly(
                replyStub,
                {
                    content: 'Arrrr, something went wrong!',
                    ephemeral: true
                }
            )
        })
    })
})
