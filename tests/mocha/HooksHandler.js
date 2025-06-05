'use strict'

/* eslint-disable */

import * as chai from 'chai'
import { describe, it } from 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
import HooksHandler from '../../app/HooksHandler.js'
import Interaction from '../../app/Interaction.js'
import db from '../../models/index.js'
import Hook from '../../valueObjects/hook.js'

import { mock } from '../config.js'
const { interaction, hook } = mock

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
                guildId: info.guildId,
                status: 'active'
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
                guildId: info.guildId,
                status: 'active'
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
        const info = Interaction.getInfos(interaction)

        const response = await HooksHandler.getHookPollLines(info)

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

    it('HooksHandler.getHookSelectOptions should return array of objects', async () => {
        const MissionHookstub = sinon.spy(HooksHandler, 'getHooks')

        const response = await HooksHandler.getHookSelectOptions(
            Interaction.getInfos(interaction),
            'delete'
        )

        sinon.assert.calledOnce(MissionHookstub)
        sinon.assert.match(
            response,
            [
                {
                    label: 'myDM',
                    description: 'myTitle...',
                    value: '1,delete'
                }
            ]
        )
    })

    it('HooksHandler.hide should change DB entry', async () => {
        const hideStub = sinon.spy(db.missionHooks, 'update')
        sinon.spy(console, 'log')
        const id = 1

        await HooksHandler.hide(id)
        const result = await HooksHandler.getOne(id)

        sinon.assert.calledOnceWithExactly(
            hideStub,
            {
                status: 'hidden'
            }, {
                where: {
                    id: id
                }
            }
        )
        expect(console.log).to.have.been.calledWith([id])
        sinon.assert.match(result[0].dataValues.status, 'hidden')
    })

    it('HooksHandler.unhide should change DB entry', async () => {
        const unhideStub = sinon.spy(db.missionHooks, 'update')
        sinon.spy(console, 'log')
        const id = 1
        await HooksHandler.hide(id)
        const intermediateResult = await HooksHandler.getOne(id)
        sinon.assert.match(
            intermediateResult[0].dataValues.status,
            'hidden'
        )

        await HooksHandler.unhide(id)
        const result = await HooksHandler.getOne(id)

        expect(console.log).to.have.been.calledWith([id])
        sinon.assert.match(result[0].dataValues.status, 'active')
    })
})
