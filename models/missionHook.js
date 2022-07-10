const Sequelize = require('sequelize')
const sequelize = require('./ORM')

const MissionHook = sequelize.define('missionHooks', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        unique: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    dm: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tier: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    checkpoints: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    treasurePoints: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
})

module.exports = MissionHook
