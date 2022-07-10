'use strict'

//* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { describe, it } = require('mocha')
const HooksHandler = require('../../helper/HooksHandler')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('../helper/HookHandler', () => {
    describe('# get', () => {
        it('will always succeed', () => {
            return expect(HooksHandler.get()).to.not.be.rejectedWith()
        })
    })
    describe('# getPoll', () => {
        it('will always succeed', () => {
            return expect(HooksHandler.getPoll()).to.not.be.rejectedWith()
        })
    })
})
