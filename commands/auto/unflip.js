const Command = require('./shared/AutoReply');

module.exports = class UnflipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unflip',
			group: 'auto',
			memberName: 'unflip',
			description: 'Unflips a flipped table.',
			patterns: [/\(╯°□°）╯︵ ┻━┻/i]
		});
	}

	generateText() {
		return '┬─┬ ノ( ゜-゜ノ)';
	}
};
