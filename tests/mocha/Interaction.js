'use strict'

/* eslint-disable */

const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = import('chai-as-promised'); // Dynamic import
const sinonChai = require('sinon-chai')
chaiAsPromised.then(module => {
    chai.use(module.default);
});
chai.use(sinonChai)
const expect = chai.expect

const Interaction = require('../../app/Interaction')
const { interaction } = require('../config')

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
