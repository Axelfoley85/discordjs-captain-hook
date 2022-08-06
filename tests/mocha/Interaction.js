'use strict'

/* eslint-disable */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Interaction = require('../../helper/Interaction')
const { interaction } = require('../config')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('helper/Interaction.js', () => {
    describe('# getInfos', () => {
        it('will return expected values', () => {
            return expect(Interaction.getInfos(interaction)).to.deep.equal(
                {
                    username: 'myUsername',
                    userId: 1,
                    guildId: 2,
                    channelId: 3,
                    channelName: 'myChannelName',
                    type: 4
                }
            )
        })
    })
})
