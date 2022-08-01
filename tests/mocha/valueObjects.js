'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { hook } = require('../config')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('../../valueObjects/hook.js', () => {
    describe('# toString', () => {
        it('will return expected values', () => {
            return expect(hook.toString()).to.equal(
                '**myTitle**\n*myDM, tier 1 - 1 checkpoints*\nmyDescr'
            )
        })
    })

    describe('# toPoll', () => {
        it('will return expected values', () => {
            return expect(hook.toPoll()).to.equal(
                '**myTitle**, tier 1, myDM'
            )
        })
    })
})
