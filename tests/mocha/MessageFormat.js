'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const MessageFormat = require('../../appssageFormat')
const { EmbedBuilder } = require('discord.js')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('../../appssageFormat', () => {
    describe('# embedMessageFrom', () => {
        it('will return expected object', () => {
            return expect(MessageFormat.embedMessageFrom('Some text')).to.be.
                instanceof(EmbedBuilder)
        })
    })

    describe('# addAlphabetPrefix', () => {
        it('will return array with alphabet prefix', () => {
            return expect(MessageFormat.addAlphabetPrefix(['1', '2', '3']))
                .to.deep.equal([ '🇦 1', '🇧 2', '🇨 3' ])
        })
    })

    describe('# arrayToText', () => {
        it('will turn array of string lines into text with linebreaks', () => {
            return expect(MessageFormat.arrayToText(['1', '2', '3']))
                .to.deep.equal( '1\n2\n3\n' )
        })
    })
})
