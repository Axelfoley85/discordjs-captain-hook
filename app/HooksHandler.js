const db = require('../models')
const Hook = require('../valueObjects/hook')

class HooksHandler {
    static async getHooks (filter = {}) {
        const hooks = []
        const hooklist = await db.missionHooks.findAll(filter)
        hooklist.forEach(
            (hookItem) => {
                hooks.push(new Hook(
                    hookItem.dataValues.title,
                    hookItem.dataValues.dm,
                    hookItem.dataValues.tier,
                    hookItem.dataValues.checkpoints,
                    hookItem.dataValues.description,
                    hookItem.dataValues.userId,
                    hookItem.dataValues.guildId,
                    hookItem.dataValues.id
                ))
            }
        )
        return hooks
    }

    static async getFullHookDescriptions (filter = {}) {
        let string = ''
        const hooklist = await HooksHandler.getHooks(filter)

        hooklist.forEach(
            (hook) => {
                string += '\n\n' + hook.toString()
            }
        )

        return string
    }

    static async getHookPollLines (filter = {}) {
        const hooklist = await HooksHandler.getHooks(filter)
        const string = []
        hooklist.forEach(
            (hook) => {
                string.push(hook.toPollString())
            }
        )

        return string
    }

    static async getHookDeleteOptions (filter = {}) {
        const hooklist = await HooksHandler.getHooks(filter)
        const deleteOptions = []
        hooklist.forEach(
            (hook) => {
                deleteOptions.push(
                    {
                        label: `${hook.dm}`,
                        description: `${hook.title.substring(0, 25)}...`,
                        value: `${hook.id}`
                    }
                )
            }
        )

        return deleteOptions
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
}

module.exports = HooksHandler
