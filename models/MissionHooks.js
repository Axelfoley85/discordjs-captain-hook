'use strict'

const {
    Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class MissionHooks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate (models) {
            // define association here
        }
    }
    MissionHooks.init({
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        dm: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        tier: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        checkpoints: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        guildId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.STRING(255),
            allowNull: false,
            // pseudo ENUM: active, hidden, deleted, outdated
            defaultValue: 'active'
        }
    }, {
        sequelize,
        modelName: 'missionHooks',
        tableName: 'missionHooks',
        timestamps: true,
        indexes: [
            {
                name: 'sqlite_autoindex_missionHooks_1',
                unique: true,
                fields: [
                    { name: 'title' }
                ]
            }
        ]
    })
    return MissionHooks
}
