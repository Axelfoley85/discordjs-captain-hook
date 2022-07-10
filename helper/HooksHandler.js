const MissionHook = require('../models/missionHook.js')
const { hookToString, hookToPoll } = require('./hookToString')
const { alphabet } = require('../models/valueObjects')

class Hooks {
    static async get () {
        const hooklist = await MissionHook.findAll()
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
                        item.treasurePoints,
                        item.description
                    )
            }
        )

        return string
    }

    static async getPoll () {
        const hooklist = await MissionHook.findAll()
        let string = ''
        let i = 0
        hooklist.forEach(
            (hook) => {
                const item = hook.dataValues
                string += alphabet[i] + ' ' + hookToPoll(
                    item.title,
                    item.dm,
                    item.tier
                ) + '\n'
                i++
            }
        )

        return [string, i]
    }

    static async delete (id) {
        const response = await MissionHook.destroy({
            where: {
                id
            }
        })
        console.log(response)
    }

    static async getOne (id) {
        const hooklist = await MissionHook.findAll({
            where: {
                id
            }
        })

        return hooklist
    }
};

module.exports = Hooks
