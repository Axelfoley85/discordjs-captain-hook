class HookToString {
    static hookToString(title, dm, tier, checkpoints, treasurePoints, description) {
        let string = "**" + title + "**,\n*" +
            dm + ", " +
            "tier " + tier + " - " +
            checkpoints + " checkpoints, " +
            treasurePoints + " treasure points*"
        if (typeof description !== 'undefined') {
            string += "\n" + description
        }
        return string
    }

    static hookToPoll(title, dm, tier) {
        let string =  "**" + title + "**" +
            "tier " + tier + ", " + 
            dm
            
        return string
    }
}

module.exports = HookToString;