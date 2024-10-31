class Hook {
    constructor (
        title,
        dm,
        tier,
        checkpoints,
        description,
        userId,
        guildId,
        id = undefined
    ) {
        this.id = id
        this.title = title
        this.dm = dm
        this.tier = tier
        this.checkpoints = checkpoints
        this.description = description
        this.userId = userId
        this.guildId = guildId
    }

    get () {
        return {
            id: this.id,
            title: this.title,
            dm: this.dm,
            tier: this.tier,
            checkpoints: this.checkpoints,
            description: this.description,
            userId: this.userId,
            guildId: this.guildId
        }
    }

    dbEntry () {
        return {
            title: this.title,
            dm: this.dm,
            tier: this.tier,
            checkpoints: this.checkpoints,
            description: this.description,
            userId: this.userId,
            guildId: this.guildId
        }
    }

    toString () {
        let string = '**' + this.title + '**\n*' +
            this.dm + ', ' +
            'tier ' + this.tier + ' - ' +
            this.checkpoints + ' checkpoints*'
        if (typeof this.description !== 'undefined') {
            string += '\n' + this.description
        }
        return string
    }

    toPollString () {
        const string = '**' + this.title + '**, ' +
            'tier ' + this.tier + ', ' +
            this.dm

        return string
    }
}

export default Hook
