const Hooks = require('../helper/HooksHandler');
const MissionHook = require('../models/missionHook.js');

async function testOne(id) {
  const response = await Hooks.getOne(id)
    if (typeof response[0] == 'undefined') {
      console.log(id + " does not exist");
    } else {
      console.log(response[0]);
    }
}

(async () => {
    try {
        // await MissionHook.create({
        //     title: "Ask for Dax Winterfield in the Golden Mug",
        //     description: "Ask for Dax Winterfield in the Golden Mug about the raided delivery for Aldig's Inn.",
        //     dm: "Axel",
        //     tier: 1,
        //     checkpoints: 4,
        //     treasurePoints: 2,
        // });
        // await MissionHook.create({
        //     title: "Talk to Bredan Murielson's superior, Irsu Kewap",
        //     description: "Talk to Bredan Murielson's superior, Irsu Kewap, about other locations impacted by the gods whose strengths are fed and profiting of the current conflicts.",
        //     dm: "Axel",
        //     tier: 1,
        //     checkpoints: 4,
        //     treasurePoints: 2,
        // });
        // await MissionHook.create({
        //     title: "The Underground Cult (easy and wacky)",
        //     description: "Rumours of something new in town are spreading fast, people are seen walking with confused minds and authorities are looking for information. Will you discover the truth that lays underground?",
        //     dm: "Tam",
        //     tier: 1,
        //     checkpoints: 4,
        //     treasurePoints: 2,
        // });
        // await MissionHook.create({
        //     title: "Track down Dream and Moon",
        //     description: "Track down Dream and Moon, who have gone missing near the Westwoods.",
        //     dm: "Hannah",
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

        const response = await Hooks.get()
        console.log(response);

        await testOne(3);
        await testOne(9999);

        console.log(await Hooks.getPoll());
  
    } catch (e) {
        console.error(e);
    };
})().catch((e) => console.error());
