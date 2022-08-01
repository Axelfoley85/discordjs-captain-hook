const db = require('../models')
const Hook = require('../valueObjects/hook')

class HooksHandler {
    static async get () {
        const hooklist = await db.missionHooks.findAll()
        let string = ''
        hooklist.forEach(
            (hookItem) => {
                const hook = new Hook(
                    hookItem.dataValues.title,
                    hookItem.dataValues.dm,
                    hookItem.dataValues.tier,
                    hookItem.dataValues.checkpoints,
                    hookItem.dataValues.description
                )
                string += '\n\n**#' + hookItem.dataValues.id + '**\n' +
                    hook.toString()
            }
        )

        return string
    }

    static async getHookPollLines () {
        const hooklist = await db.missionHooks.findAll()
        console.log(hooklist)
        const string = []
        hooklist.forEach(
            (hookItem) => {
                const hook = new Hook(
                    hookItem.dataValues.title,
                    hookItem.dataValues.dm,
                    hookItem.dataValues.tier,
                    hookItem.dataValues.checkpoints,
                    hookItem.dataValues.description
                )
                string.push(hook.toPoll())
            }
        )

        return string
    }

    static async delete (id) {
        const response = await db.missionHooks.destroy({
            where: {
                id
            }
        })
        console.log(response)
    }

    static async getOne (id) {
        const idEntry = await db.missionHooks.findAll({
            where: {
                id
            }
        })

        return idEntry
    }
};

module.exports = HooksHandler
