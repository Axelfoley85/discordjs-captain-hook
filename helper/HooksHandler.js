const db = require('../models')
const { hookToString, hookToPoll } = require('./MessageFormat')

class Hooks {
    static async get () {
        const hooklist = await db.missionHooks.findAll()
        let string = ''
        hooklist.forEach(
            (hook) => {
                const item = hook.dataValues
                string += '\n\n**#' + item.id + '**\n' +
                    hookToString(
                        item.title,
                        item.dm,
                        item.tier,
                        item.checkpoints,
                        item.description
                    )
            }
        )

        return string
    }

    static async getHookPollLines () {
        const hooklist = await db.missionHooks.findAll()
        console.log(hooklist)
        const string = []
        hooklist.forEach(
            (hook) => {
                const item = hook.dataValues
                string.push(
                    hookToPoll(
                        item.title,
                        item.dm,
                        item.tier
                    )
                )
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

module.exports = Hooks
