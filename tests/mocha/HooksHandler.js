'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { describe } = require('mocha')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const HooksHandler = require('../../helper/HooksHandler')
const db = require('../../models')
const Hook = require('../../valueObjects/hook')
const { missionHookEntry, hook } = require('../config')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

describe('../../helper/HooksHandler', () => {

    beforeEach( async function () {
        await db.missionHooks.sync({
            force: true
        })
        await db.missionHooks.create(hook.get())
    })

    afterEach(() => {
        sinon.restore()
    })

    it('getOne should return id', async () => {
        it('getOne should return db entry', async () => {
            const expectedHook = new Hook(
                'myTitle',
                'myDM',
                1,
                1,
                'myDescr'
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
                        hookItem.dataValues.description
                    )
                }
            )
    
            expect(responseHook).to.deep.equal(expectedHook)
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

    it('HooksHandler.get should return string', async () => {
        const MissionHookstub = sinon.spy(db.missionHooks, 'findAll')

        const response = await HooksHandler.get()
        const cleanedResponse = response.replace(/(\n\n|\n)/gm, '')

        sinon.assert.calledOnce(MissionHookstub)
        sinon.assert.match(
            cleanedResponse,
            '**#1****myTitle***myDM, tier 1 - 1 checkpoints*myDescr'
        )
    })
})
