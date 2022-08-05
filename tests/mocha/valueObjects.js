'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Hook = require('../../valueObjects/hook')
const { hook } = require('../config')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('../../valueObjects/hook.js', () => {
    describe('# toString', () => {
        it('will return expected values', () => {
            return expect(hook.toString()).to.equal(
                '\n\n**#1**\n**myTitle**\n*myDM, tier 1 - 1 checkpoints*\nmyDescr'
            )
        })
    })

    describe('# toPollString', () => {
        it('will return expected values', () => {
            return expect(hook.toPollString()).to.equal(
                '**myTitle**, tier 1, myDM'
            )
        })
    })

    describe('# get', () => {
        it('will return expected values', () => {
            return expect(hook.get()).to.deep.equal(
                {
                    checkpoints: 1,
                    description: 'myDescr',
                    dm: 'myDM',
                    id: 1,
                    tier: 1,
                    title: 'myTitle'
                }
            )
        })
    })

    describe('# postDbEntry', () => {
        it('will return expected values', () => {
            return expect(hook.postDbEntry()).to.deep.equal(
                {
                    checkpoints: 1,
                    description: 'myDescr',
                    dm: 'myDM',
                    tier: 1,
                    title: 'myTitle'
                }
            )
        })
    })
})
