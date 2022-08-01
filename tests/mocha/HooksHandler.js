'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { describe } = require('mocha')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const HooksHandler = require('../../helper/HooksHandler')
const db = require('../../models')
const { missionHookEntry } = require('../config')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

describe('../../helper/HooksHandler', () => {
    // eslint-disable-next-line no-undef
    afterEach(() => {
        sinon.restore()
    })

    it('getOne should return id', async () => {
        sinon.stub(db.missionHooks, 'findAll').resolves(missionHookEntry)

        const response = await HooksHandler.getOne(1)

        expect(response).to.equal(missionHookEntry)
    })

    it('HooksHandler.delete should output to console log', async () => {
        sinon.spy(console, 'log')
        const id = 1
        const MissionHookstub = sinon.stub(db.missionHooks, 'destroy').resolves(id)

        await HooksHandler.delete(id)

        sinon.assert.calledOnceWithExactly(
            MissionHookstub,
            { where: { id: 1 } }
        )
        expect(console.log).to.have.been.calledWith(id)
    })

    it('HooksHandler.getHookPollLines should return array with hooks', async () => {
        const MissionHookstub = sinon.stub(db.missionHooks, 'findAll').resolves(
            missionHookEntry
        )

        const response = await HooksHandler.getHookPollLines()

        sinon.assert.calledOnce(MissionHookstub)
        // eslint-disable-next-line max-len
        expect(response).to.deep.equal(['**Ask for Dax Winterfield in the Golden Mug**, tier 1, Axel'])
    })

    it('HooksHandler.get should return string', async () => {
        const MissionHookstub = sinon.stub(db.missionHooks, 'findAll').resolves(
            missionHookEntry
        )

        const response = await HooksHandler.get()
        const cleanedResponse = response.replace(/(\n\n|\n)/gm, '')
        console.log(cleanedResponse)

        sinon.assert.calledOnce(MissionHookstub)
        // eslint-disable-next-line max-len
        sinon.assert.match(
            cleanedResponse,
            '**#1****Ask for Dax Winterfield in the Golden Mug***Axel, tier 1 - 4 checkpoints*'
        )
    })
})
