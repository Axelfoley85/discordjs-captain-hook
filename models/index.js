'use strict'

import fs from 'fs'
import path from 'path'
import { Sequelize } from 'sequelize'
import { config } from '../config.js'

const __filename = new URL(import.meta.url).pathname
const __dirname = path.dirname(__filename)
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'default'
const CONFIG = config[env]
const db = {}

let sequelize
if (CONFIG.use_env_variable) {
    sequelize = new Sequelize(process.env[CONFIG.use_env_variable], CONFIG)
} else {
    sequelize = new Sequelize(
        CONFIG.database,
        CONFIG.username,
        CONFIG.password,
        CONFIG
    )
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0
        ) && (file !== basename
        ) && (file.slice(-3) === '.js')
    })
    .forEach(async file => {
        const model = (await import(
            path.join(__dirname, file)
        )).default(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
