/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const Hooks = require('../helper/HooksHandler')
const MissionHook = require('../models/missionHook.js')

async function testOne (id) {
    const response = await Hooks.getOne(id)
    if (typeof response[0] === 'undefined') {
        console.log(id + ' does not exist')
    } else {
        console.log(response[0])
    }
}

class FakeClient {
    constructor () {
        this.foo = 'bar'
    }

    channel (self) {
        return self.foo
    }
}

(async () => {
    try {
        // await MissionHook.create({
        //     title: 'Ask for Dax Winterfield in the Golden Mug',
        //     description: "Ask for Dax Winterfield in the Golden Mug about the raided delivery for Aldig's Inn.",
        //     dm: 'Axel',
        //     tier: 1,
        //     checkpoints: 4,
        //     treasurePoints: 2
        // })
        // await MissionHook.create({
        //     title: "Talk to Bredan Murielson's superior, Irsu Kewap",
        //     description: "Talk to Bredan Murielson's superior, Irsu Kewap, about other locations impacted by the gods whose strengths are fed and profiting of the current conflicts.",
        //     dm: 'Axel',
        //     tier: 1,
        //     checkpoints: 4,
        //     treasurePoints: 2
        // })
        // await MissionHook.create({
        //     title: "The Underground Cult (easy and wacky)",
        //     description: "Rumours of something new in town are spreading fast, people are seen walking with confused minds and authorities are looking for information. Will you discover the truth that lays underground?",
        //     dm: "Tam",
        //     tier: 1,
        //     checkpoints: 4,
        //     treasurePoints: 2,
        // });
        // await MissionHook.create({
        //     title: "Attend Duke Oleander's birthday party",
        //     description: "Attend Duke Oleander's birthday party and help Daleth \"acquire\" a mysterious artefact locked in the Duke's vault.",
        //     dm: "Hannah",
        //     tier: 2,
        //     checkpoints: 4,
        //     treasurePoints: 2,
        // });
        // await Hooks.delete(16)

        // const response = await Hooks.get()
        // console.log(response)

        // await testOne(3)
        // await testOne(9999)

        // console.log(await Hooks.get())
        // console.log(typeof (await Hooks.getOne(1)))

        // class Client {
        //     channels = {
        //         cache: {
        //             get () { return 'myChannel' }
        //         }
        //     }
        // }

        const client = new FakeClient()
        const channel = client.channel()

        console.log(channel)

        // console.log(client)

        // const channel = client.channels.cache.get()
        // console.log(channel)
    } catch (e) {
        console.error(e)
    };
})().catch((e) => console.error())
