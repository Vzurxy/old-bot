const Command = require('./shared/Command');

module.exports = class LeaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['leave-voice-channel', 'leave-vc', 'leave-voice', 'leave-channel'],
			group: 'util-public',
			memberName: 'sudoleave',
			description: 'Leaves the current voice channel.',
			guildOnly: true,
			guarded: true,
			userPermissions: ['MOVE_MEMBERS']
		});
	}

	run(msg) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) return msg.reply('I am not in a voice channel. ❌');
		connection.channel.leave();
		return msg.reply(`:mailbox_with_no_mail: **Successfully disconnected from** \`${connection.channel.name}\`!`);
	}
};
