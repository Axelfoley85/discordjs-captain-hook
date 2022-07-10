'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const HookToString = require('../../helper/hookToString')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('../helper/hookToString', () => {
    describe('# hookToString', () => {
        it('will return expected values', () => {
            return expect(HookToString.hookToString('myTitle', 'myDM', 1, 1, 1, 'myDescr')).to.equal(
                '**myTitle**\n*myDM, tier 1 - 1 checkpoints, 1 treasure points*\nmyDescr'
            )
        })
    })
    describe('# hookToPoll', () => {
        it('will return expected values', () => {
            return expect(HookToString.hookToPoll('myTitle', 'myDM', 1)).to.equal(
                '**myTitle**, tier 1, myDM'
            )
        })
    })
})
