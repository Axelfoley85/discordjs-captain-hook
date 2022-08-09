'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { describe, it } = require('mocha')
const { Op } = require('sequelize')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const HooksHandler = require('../../app/HooksHandler')
const Interaction = require('../../app/Interaction')
const db = require('../../models')
const Hook = require('../../valueObjects/hook')
const { hook, interaction } = require('../config')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

describe('../../app/HooksHandler', () => {

    beforeEach( async function () {
        await db.missionHooks.sync({
            force: true
        })
        await db.missionHooks.create(hook.dbEntry())
    })

    afterEach(() => {
        sinon.restore()
    })

    it('getOne should return hook of id', async () => {
        const expectedHook = new Hook(
            'myTitle',
            'myDM',
            1,
            2,
            'myDescr',
            3,
            4,
            1
        )
        const response = await HooksHandler.getOne(1)
        let responseHook
        response.forEach(
            (hookItem) => {
                responseHook = new Hook(
                    hookItem.dataValues.title,
                    hookItem.dataValues.dm,
                    hookItem.dataValues.tier,
                    hookItem.dataValues.checkpoints,
                    hookItem.dataValues.description,
                    hookItem.dataValues.userId,
                    hookItem.dataValues.guildId,
                    hookItem.dataValues.id
                )
            }
        )

        expect(responseHook).to.deep.equal(expectedHook)
    })

    describe('#getHooks', async () => {
        it('should return all hooks in db', async function () {
            const expectedHook = new Hook(
                'myTitle',
                'myDM',
                1,
                2,
                'myDescr',
                3,
                4,
                1
            )
            const response = await HooksHandler.getHooks()
    
            expect(response[0]).to.deep.equal(expectedHook)
        })

        it('should filter successfully', async function () {
            const info = {
                username: 'myUsername',
                userId: 11,
                guildId: 21,
                channelId: 31,
                channelName: 'myChannelName',
                type: 41
            }
            const expectedHook = new Hook(
                'myTitle2',
                info.username,
                1,
                1,
                'myDescr',
                info.userId,
                info.guildId,
                2
            )

            await db.missionHooks.create(expectedHook.dbEntry())
            let filter = {}
            filter = { where: {
                userId: info.userId,
                guildId: info.guildId
            }}
            const response = await HooksHandler.getHooks(filter)
    
            expect(response[0]).to.deep.equal(expectedHook)
        })

        it('should return undefined unexisting filtering', async function () {
            const info = {
                username: 'myUsername',
                userId: 11,
                guildId: 21,
                channelId: 31,
                channelName: 'myChannelName',
                type: 41
            }
            const expectedHook = new Hook(
                'myTitle2',
                info.username,
                1,
                1,
                'myDescr',
                info.userId,
                info.guildId,
                2
            )

            await db.missionHooks.create(expectedHook.dbEntry())
            let filter = {}
            filter = { where: {
                userId: -9999,
                guildId: info.guildId
            }}
            const response = await HooksHandler.getHooks(filter)
    
            expect(response[0]).to.equal(undefined)
        })
    })

    it('HooksHandler.delete should output to console log', async () => {
        const deleteStub = sinon.spy(db.missionHooks, 'destroy')
        sinon.spy(console, 'log')
        const id = 1

        await HooksHandler.delete(id)

        sinon.assert.calledOnceWithExactly(
            deleteStub,
            { where: { id: id } }
        )
        expect(console.log).to.have.been.calledWith(id)
    })

    it('HooksHandler.getHookPollLines should return array with hooks', async () => {
        const response = await HooksHandler.getHookPollLines()

        expect(response).to.deep.equal(['**myTitle**, tier 1, myDM'])
    })

    it('HooksHandler.getFullHookDescriptions should return string', async () => {
        const MissionHookstub = sinon.spy(HooksHandler, 'getHooks')

        const response = await HooksHandler.getFullHookDescriptions()
        const cleanedResponse = response.replace(/(\n\n|\n)/gm, '')

        sinon.assert.calledOnce(MissionHookstub)
        sinon.assert.match(
            cleanedResponse,
            '**myTitle***myDM, tier 1 - 2 checkpoints*myDescr'
        )
    })

    it('HooksHandler.getHookDeleteOptions should return array of objects', async () => {
        const MissionHookstub = sinon.spy(HooksHandler, 'getHooks')

        const response = await HooksHandler.getHookDeleteOptions(
            Interaction.getInfos(interaction)
        )

        sinon.assert.calledOnce(MissionHookstub)
        sinon.assert.match(
            response,
            [
                { 
                    label: 'myDM',
                    description: 'myTitle...',
                    value: '1'
                } 
            ]
        )
    })
})
