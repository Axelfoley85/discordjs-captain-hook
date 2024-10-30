'use strict'

/* eslint-disable */

import sinon from 'sinon'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'

import { mock } from '../config.js'
const { interaction, client, channel, hook } = mock

import db from '../../models/index.js'

chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect

import Hook from '../../valueObjects/hook.js'

describe('../../commands', function () {
    beforeEach(async function () {
        sinon.spy(console, 'error')
        sinon.spy(console, 'log')
        await db.missionHooks.sync({
            force: true
        })
        await db.missionHooks.create(hook.dbEntry())
    })

    console.log("Type of hook:", typeof hook)
    console.log("Type of Hook:", typeof Hook)
    console.log("Type of Hook constructor:", typeof new Hook('title', 'dm', 1, 2, 'description', 3, 4))
    // console.log("Type of Hook.dbEntry:", typeof Hook.dbEntry)
    // console.log("Type of Hook prototype dbEntry:", typeof Hook.prototype.dbEntry)

    // const testHookInstance = new Hook('title', 'dm', 1, 2, 'description', 3, 4)
    // console.log("Instance of Hook created:", testHookInstance)
    // console.log("Type of testHookInstance:", typeof testHookInstance)
    // console.log("Type of testHookInstance.dbEntry:", typeof testHookInstance.dbEntry)

    afterEach(function () {
        sinon.restore()
    })
})
