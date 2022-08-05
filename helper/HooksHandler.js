const db = require('../models')
const Hook = require('../valueObjects/hook')

class HooksHandler {
    static async getHooks () {
        const hooks = []
        const hooklist = await db.missionHooks.findAll()
        hooklist.forEach(
            (hookItem) => {
                hooks.push(new Hook(
                    hookItem.dataValues.title,
                    hookItem.dataValues.dm,
                    hookItem.dataValues.tier,
                    hookItem.dataValues.checkpoints,
                    hookItem.dataValues.description,
                    hookItem.dataValues.id
                ))
            }
        )
        return hooks
    }

    static async getFullHookDescriptions () {
        let string = ''
        const hooklist = await HooksHandler.getHooks()

        hooklist.forEach(
            (hook) => {
                string += hook.toString()
            }
        )

        return string
    }

    static async getHookPollLines () {
        const hooklist = await HooksHandler.getHooks()
        const string = []
        hooklist.forEach(
            (hook) => {
                string.push(hook.toPollString())
            }
        )

        return string
    }

    static async getHookDeleteOptions () {
        const hooklist = await HooksHandler.getHooks()
        const deleteOptions = []
        hooklist.forEach(
            (hook) => {
                deleteOptions.push(
                    {
                        label: `#${hook.id} by ${hook.dm}`,
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
