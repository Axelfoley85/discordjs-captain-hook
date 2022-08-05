class Hook {
    constructor (title, dm, tier, checkpoints, description, id = undefined) {
        this.id = id
        this.title = title
        this.dm = dm
        this.tier = tier
        this.checkpoints = checkpoints
        this.description = description
    }

    get () {
        return {
            id: this.id,
            title: this.title,
            dm: this.dm,
            tier: this.tier,
            checkpoints: this.checkpoints,
            description: this.description
        }
    }

    postDbEntry () {
        return {
            title: this.title,
            dm: this.dm,
            tier: this.tier,
            checkpoints: this.checkpoints,
            description: this.description
        }
    }

    toString () {
        let string = ''
        if (typeof this.id !== 'undefined') {
            string += '\n\n**#' + this.id + '**\n'
        }
        string += '**' + this.title + '**\n*' +
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

module.exports = Hook
