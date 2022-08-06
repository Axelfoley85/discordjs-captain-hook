'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface
                    .addColumn(
                        'MissionHooks',
                        'status',
                        {
                            type: Sequelize.STRING(255),
                            allowNull: false,
                            // pseudo ENUM: active, hidden, deleted, outdated
                            defaultValue: 'active'
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
                        'status',
                        { transaction: t }
                    )
            ])
        })
    }
}
