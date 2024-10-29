'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = import('chai-as-promised'); // Dynamic import
chaiAsPromised.then(module => {
    chai.use(module.default);
});
const expect = chai.expect

const MessageFormat = require('../../app/MessageFormat')
const { EmbedBuilder } = require('discord.js')

describe('../../app/MessageFormat', () => {
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
