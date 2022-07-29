'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface
                    .removeColumn(
                        'MissionHooks',
                        'treasurePoints',
                        { transaction: t })
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface
                    .addColumn(
                        'MissionHooks',
                        'treasurePoints',
                        {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                            defaultValue: 0
                        }, { transaction: t })
            ])
        })
    }
}
