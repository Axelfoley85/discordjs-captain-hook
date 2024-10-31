'use strict'

/* eslint-disable */

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
import Interaction from '../../app/Interaction.js'

import { mock } from '../config.js'
const { interaction } = mock

chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect


describe('app/Interaction.js', function () {
    describe('# getInfos', function () {
        it('will return expected values', function () {
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

    describe('# postError', function () {
        it('sends interaction.reply', async function () {
            const replyStub = sinon.stub(interaction, 'reply')

            await Interaction.postError(interaction)

            sinon.assert.calledOnceWithExactly(
                replyStub,
                {
                    content: 'Arrrrr, there was an error while executing this command!',
                    ephemeral: true
                }
            )
        })
    })
})
