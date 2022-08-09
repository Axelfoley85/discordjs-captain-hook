'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Interaction = require('../../app/Interaction')
const { interaction } = require('../config')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('app/Interaction.js', () => {
    describe('# getInfos', () => {
        it('will return expected values', () => {
            return expect(Interaction.getInfos(interaction)).to.deep.equal(
                {
                    username: 'myUsername',
                    userId: 3,
                    guildId: 4,
                    channelId: 5,
                    channelName: 'myChannelName',
                    type: 6
                }
            )
        })
    })
})
