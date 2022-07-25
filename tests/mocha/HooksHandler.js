'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { describe } = require('mocha')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const HooksHandler = require('../../helper/HooksHandler')
const MissionHook = require('../../models/missionHook')
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
        sinon.stub(MissionHook, 'findAll').resolves(missionHookEntry)

        const response = await HooksHandler.getOne(1)

        expect(response).to.equal(missionHookEntry)
    })

    it('HooksHandler.delete should output to console log', async () => {
        sinon.spy(console, 'log')
        const id = 1
        const MissionHookstub = sinon.stub(MissionHook, 'destroy').resolves(id)

        await HooksHandler.delete(id)

        sinon.assert.calledOnceWithExactly(
            MissionHookstub,
            { where: { id: 1 } }
        )
        expect(console.log).to.have.been.calledWith(id)
    })

    it('HooksHandler.getHookPollLines should return array with hooks', async () => {
        const MissionHookstub = sinon.stub(MissionHook, 'findAll').resolves(
            missionHookEntry
        )

        const response = await HooksHandler.getHookPollLines()

        sinon.assert.calledOnce(MissionHookstub)
        // eslint-disable-next-line max-len
        expect(response).to.deep.equal(['**Ask for Dax Winterfield in the Golden Mug**, tier 1, Axel'])
    })

    it('HooksHandler.get should return string', async () => {
        const MissionHookstub = sinon.stub(MissionHook, 'findAll').resolves(
            missionHookEntry
        )

        const response = await HooksHandler.get()

        sinon.assert.calledOnce(MissionHookstub)
        // eslint-disable-next-line max-len
        expect(response[0]).to.deep.equal(
            // This should return several lines of string, but isn't fetched
            // here in the test
            '\n'
        )
        expect(response[1]).to.equal('\n')
    })
})
