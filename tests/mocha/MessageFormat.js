'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const MessageFormat = require('../../helper/MessageFormat')
const { MessageEmbed } = require('discord.js')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('../helper/hookToString', () => {
    describe('# hookToString', () => {
        it('will return expected values', () => {
            return expect(MessageFormat.hookToString('myTitle', 'myDM', 1, 1, 1, 'myDescr')).to.equal(
                '**myTitle**\n*myDM, tier 1 - 1 checkpoints, 1 treasure points*\nmyDescr'
            )
        })
    })
    describe('# hookToString', () => {
        it('return undefined values on missing parameters', () => {
            return expect(MessageFormat.hookToString()).to.equal(
                '**undefined**\n*undefined, tier undefined - undefined checkpoints, undefined treasure points*'
            )
        })
    })
    describe('# hookToPoll', () => {
        it('will return expected values', () => {
            return expect(MessageFormat.hookToPoll('myTitle', 'myDM', 1)).to.equal(
                '**myTitle**, tier 1, myDM'
            )
        })
    })
    describe('# hookToPoll', () => {
        it('return undefined values on missing parameters', () => {
            return expect(MessageFormat.hookToPoll()).to.equal(
                '**undefined**, tier undefined, undefined'
            )
        })
    })
    describe('# embedMessageFrom', () => {
        it('will return expected object', () => {
            return expect(MessageFormat.embedMessageFrom('Some text')).to.be.
                instanceof(MessageEmbed)
        })
    })
})
