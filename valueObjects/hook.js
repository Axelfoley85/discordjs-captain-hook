class Hook {
    constructor (title, dm, tier, checkpoints, description) {
        this.title = title
        this.dm = dm
        this.tier = tier
        this.checkpoints = checkpoints
        this.description = description
    }

    get () {
        return {
            title: this.title,
            dm: this.dm,
            tier: this.tier,
            checkpoints: this.checkpoints,
            description: this.description
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

module.exports = Hook
