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

    static async getHookPollLines (info) {
        const hooklist = await HooksHandler.getHooks({
            where: {
                guildId: info.guildId,
                status: 'active'
            }
        })
        const pollLines = []
        hooklist.forEach(
            (hook) => {
                pollLines.push(hook.toPollString())
            }
        )

        return pollLines
    }

    static async getHookSelectOptions (
        info,
        type,
        filter = {
            where: {
                userId: info.userId,
                guildId: info.guildId
            }
        }) {
        const hooklist = await HooksHandler.getHooks(filter)
        const deleteOptions = []
        hooklist.forEach(
            (hook) => {
                deleteOptions.push(
                    {
                        label: `${hook.dm}`,
                        description: `${hook.title.substring(0, 25)}...`,
                        value: `${hook.id},${type}`
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

    static async hide (id) {
        const response = await db.missionHooks.update({
            status: 'hidden'
        }, {
            where: {
                id
            }
        })
        console.log(response)
    }

    static async unhide (id) {
        const response = await db.missionHooks.update({
            status: 'active'
        }, {
            where: {
                id
            }
        })
        console.log(response)
    }
}

module.exports = HooksHandler
