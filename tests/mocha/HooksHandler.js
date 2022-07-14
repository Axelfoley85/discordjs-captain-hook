'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { describe } = require('mocha')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const HooksHandler = require('../../helper/HooksHandler')
const MissionHook = require('../../models/missionHook')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

const missionHookEntry = [
    {
        dataValues: {
            id: 1,
            title: 'Ask for Dax Winterfield in the Golden Mug',
            // eslint-disable-next-line max-len
            description: "Ask for Dax Winterfield in the Golden Mug about the raided delivery for Aldig's Inn.",
            dm: 'Axel',
            tier: 1,
            checkpoints: 4,
            treasurePoints: 2,
            createdAt: '2022-07-10T03:25:51.279Z',
            updatedAt: '2022-07-10T03:25:51.279Z'
        }
    }
]

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
        const MissionHookstub = sinon.stub(MissionHook, 'destroy').resolves(1)

        await HooksHandler.delete(1)

        sinon.assert.calledOnce(MissionHookstub)
        expect(console.log).to.have.been.calledWith(1)
    })

    it('HooksHandler.getPoll should return string and count', async () => {
        const MissionHookstub = sinon.stub(MissionHook, 'findAll').resolves(
            missionHookEntry
        )

        const response = await HooksHandler.getPoll()

        sinon.assert.calledOnce(MissionHookstub)
        // eslint-disable-next-line max-len
        expect(response[0]).to.equal('🇦 **Ask for Dax Winterfield in the Golden Mug**, tier 1, Axel\n')
        expect(response[1]).to.equal(1)
    })

    it('HooksHandler.get should return string', async () => {
        const MissionHookstub = sinon.stub(MissionHook, 'findAll').resolves(
            missionHookEntry
        )

        const response = await HooksHandler.get()

        sinon.assert.calledOnce(MissionHookstub)
        // eslint-disable-next-line max-len
        expect(response[0]).to.equal(
            // This should return several lines of string, but isn't fetched
            // here in the test
            '\n'
        )
        expect(response[1]).to.equal('\n')
    })
})
