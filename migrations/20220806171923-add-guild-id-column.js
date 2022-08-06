'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface
                    .addColumn(
                        'MissionHooks',
                        'guildId',
                        {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                            defaultValue: 0
                        }, { transaction: t }
                    )
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface
                    .removeColumn(
                        'MissionHooks',
                        'guildId',
                        { transaction: t }
                    )
            ])
        })
    }
}
