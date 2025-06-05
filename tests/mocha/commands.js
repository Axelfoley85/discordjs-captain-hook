'use strict'

/* eslint-disable */

import sinon from 'sinon'
import * as chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Action from '../../app/Action.js'
import HooksHandler from '../../app/HooksHandler.js'
import Interaction from '../../app/Interaction.js'
import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js'

import { config } from '../../config.js'
const { hookChannel } = config

import { mock } from '../config.js'
const { interaction, client, channel, hook } = mock

import db from '../../models/index.js'

chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const commandPath = path.join(__dirname, '../../commands')

describe('../../commands', function () {
    beforeEach(async function () {
        sinon.spy(console, 'error')
        sinon.spy(console, 'log')
        await db.missionHooks.sync({
            force: true
        })
        await db.missionHooks.create(hook.dbEntry())
    })

    afterEach(function () {
        sinon.restore()
    })

    describe('updatehookchannel', function () {
        it(
            'should call updateHookChannel' +
            'post reply',
            async function () {
                const commandModule = await import(path.join(commandPath, 'updatehookchannel.js'))
                const command = commandModule.default
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
                const commandModule = await import(path.join(commandPath, 'hookpoll.js'))
                const command = commandModule.default
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
                const commandModule = await import(path.join(commandPath, 'hookadd.js'))
                const command = commandModule.default

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
                        userId: 3,
                        guildId: 4
                    }
                )
                sinon.assert.calledOnceWithExactly(
                    updateStub,
                    client,
                    hookChannel,
                    Interaction.getInfos(interaction)
                )
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
                    constructor (message) {
                        super(message)

                        this.name = this.constructor.name
                    }
                }
                const commandModule = await import(path.join(commandPath, 'hookadd.js'))
                const command = commandModule.default

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
                const commandModule = await import(path.join(commandPath, 'hookadd.js'))
                const command = commandModule.default
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
                        content: 'Arrrrr, there was an error while executing this command!',
                        ephemeral: true
                    }
                )
            })
    })

    describe('hookdelete', function () {
        it('should succede', async function () {
                const commandModule = await import(path.join(commandPath, 'hookdelete.js'))
                const command = commandModule.default
                const getStub = sinon.spy(HooksHandler, 'getHookSelectOptions')
                const replyStub = sinon.stub(interaction, 'reply')
                sinon.spy(function () {
                    return sinon.createStubInstance(ActionRowBuilder)
                })
                sinon.spy(function () {
                    return sinon.createStubInstance(StringSelectMenuBuilder)
                })

                await command.execute(interaction, client)

                sinon.assert.calledOnce(getStub)
                sinon.assert.calledOnceWithMatch(
                    replyStub,
                    { content: 'Choose the hook to delete' }
                )
            })

        it('should succede on empty DB', async function () {
                const commandModule = await import(path.join(commandPath, 'hookdelete.js'))
                const command = commandModule.default

                const getStub = sinon.stub(HooksHandler, 'getHookSelectOptions')
                    .resolves([])
                const replyStub = sinon.stub(interaction, 'reply')

                sinon.spy(function () {
                    return sinon.createStubInstance(ActionRowBuilder)
                })

                sinon.spy(function () {
                    return sinon.createStubInstance(StringSelectMenuBuilder)
                })

                await command.execute(interaction, client)

                sinon.assert.calledOnce(getStub)
                sinon.assert.calledOnceWithExactly(
                    replyStub,
                    {
                        content: 'Seems you have no hooks posted. You can ' +
                        'only delete your own hooks.',
                        ephemeral: true
                    }
                )
            })
    })

    describe('hookhide', function () {
        it(
            'should succede',
            async function () {
                const commandModule = await import(path.join(commandPath, 'hookhide.js'))
                const command = commandModule.default
                const getStub = sinon.spy(HooksHandler, 'getHookSelectOptions')
                const replyStub = sinon.stub(interaction, 'reply')

                sinon.spy(function () {
                    return sinon.createStubInstance(ActionRowBuilder)
                })

                sinon.spy(function () {
                    return sinon.createStubInstance(StringSelectMenuBuilder)
                })

                await command.execute(interaction, client)

                sinon.assert.calledOnce(getStub)
                sinon.assert.calledOnceWithMatch(
                    replyStub,
                    { content: 'Choose the hook to hide' }
                )
            })

        it(
            'should succede on empty DB',
            async function () {
                const commandModule = await import(path.join(commandPath, 'hookhide.js'))
                const command = commandModule.default
                const getStub = sinon.stub(HooksHandler, 'getHookSelectOptions')
                    .resolves([])
                const replyStub = sinon.stub(interaction, 'reply')

                sinon.spy(function () {
                    return sinon.createStubInstance(ActionRowBuilder)
                })

                sinon.spy(function () {
                    return sinon.createStubInstance(StringSelectMenuBuilder)
                })

                await command.execute(interaction, client)

                sinon.assert.calledOnce(getStub)
                sinon.assert.calledOnceWithExactly(
                    replyStub,
                    {
                        content: 'Seems you have no hooks posted. You can ' +
                        'only hide your own hooks.',
                        ephemeral: true
                    }
                )
            })
    })

    describe('hookunhide', function () {
        it('should succede', async function () {
            await HooksHandler.hide(1)
            const commandModule = await import(path.join(commandPath, 'hookunhide.js'))
            const command = commandModule.default
            const getStub = sinon.spy(HooksHandler, 'getHookSelectOptions')
            const replyStub = sinon.stub(interaction, 'reply')

            sinon.stub(function () {
                return sinon.createStubInstance(ActionRowBuilder)
            })

            sinon.stub(function () {
                return sinon.createStubInstance(StringSelectMenuBuilder)
            })

            await command.execute(interaction, client)

            sinon.assert.calledOnce(getStub)
            sinon.assert.calledOnceWithMatch(
                replyStub,
                { content: 'Choose the hook to unhide' }
            )
        })

        it(
            'should succede on empty DB',
            async function () {
                const commandModule = await import(path.join(commandPath, 'hookunhide.js'))
                const command = commandModule.default
                const getStub = sinon.stub(HooksHandler, 'getHookSelectOptions')
                    .resolves([])
                const replyStub = sinon.stub(interaction, 'reply')

                sinon.spy(function () {
                    return sinon.createStubInstance(ActionRowBuilder)
                })

                sinon.spy(function () {
                    return sinon.createStubInstance(StringSelectMenuBuilder)
                })

                await command.execute(interaction, client)

                sinon.assert.calledOnce(getStub)
                sinon.assert.calledOnceWithExactly(
                    replyStub,
                    {
                        content: 'Seems you have no hooks hidden. You can ' +
                        'only unhide your own hooks.',
                        ephemeral: true
                    }
                )
            })
    })
})
