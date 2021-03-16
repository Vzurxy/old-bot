const { thomsonCrossSectionDependencies } = require('mathjs');
const Command = require('./shared/Command');
const { verify } = require('./shared/util');

module.exports = class PickANumberCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'force-quit',
			aliases: ['forcequit'],
			group: 'games-mp',
			memberName: 'force-quit',
			description: 'Forces current game in channel to quit.',
		});
	}

	async run(message) {
        let errored = false
        try {
            this.client.games.delete(message.channel.id);
            this.client.games.forceQuit = true
        } catch {
            message.say('Something went wrong! Probably there was no game in the current channel. ❌')
            errored = true
        } finally {
            if (!errored) {
                message.say('Force quitted the current game. ✅')
            }
        }
	}
};
