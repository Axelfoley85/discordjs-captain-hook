'use strict'

/* eslint-disable */

const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
const path = require('node:path')
const Action = require('../../app/Action')
const HooksHandler = require('../../app/HooksHandler')
const { interaction, client, channel, missionHookEntry, deleteOptions, info, hook } = require('../config')
const { hookChannel } = require('../../config')
const db = require('../../models')
const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const Interaction = require('../../app/Interaction')

chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

var commandPath = path.join(__dirname, '../../commands')

describe('../../commands', function () {
    beforeEach( async function () {
        sinon.spy(console, 'error')
        sinon.spy(console, 'log')
        await db.missionHooks.sync({
            force: true
        })
        await db.missionHooks.create(hook.dbEntry())
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
                {
                    content: '**Mission hooks updated successfull** in <#0000>',
                    ephemeral: true
                }
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

    describe('hookadd', function () {
        it(
            'should call MissionHooks.create + ' + 
            'Action.updateHookChannel + ' +
            'interaction.reply + ',
        async function () {
            const command = require(path.join(commandPath, 'hookadd'))
            sinon.stub(interaction.options, 'getString')
                .withArgs('title').returns('title')
                .withArgs('description').returns('descr')
            sinon.stub(interaction.options, 'getInteger')
                .withArgs('tier').returns(1)
                .withArgs('checkpoints').returns(2)
            const createStub = sinon.spy(db.missionHooks, 'create')
            const updateStub = sinon.stub(Action, 'updateHookChannel')
            const replyStub = sinon.stub(interaction, 'reply')

            await command.execute(interaction, client)

            sinon.assert.calledOnceWithExactly(
                createStub,
                {
                    title: 'title',
                    dm: 'myUsername',
                    tier: 1,
                    checkpoints: 2,
                    description: 'descr',
                    userId: 1,
                    guildId: 2
                }
            )
            sinon.assert.calledOnceWithExactly(updateStub, client, hookChannel)
            sinon.assert.calledOnceWithExactly(
                replyStub,
                {
                    content: 'Mission hook created: \n' +
                        '**title**\n' +
                        '*myUsername, tier 1 - 2 checkpoints*\n' +
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
