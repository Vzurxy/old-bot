/* eslint-disable class-methods-use-this */

const { MessageEmbed } = require('discord.js');
const Command = require('./shared/Command');
const Economy = require('./shared/Economy');

module.exports = class Wipe extends Command {
	constructor(client) {
		super(client, {
			name: 'wipe',
			aliases: [],
			group: 'economy',
			memberName: 'wipe',
			description: "Wipe's a user's wallet and bank.",
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'user',
					prompt: 'Which member? (@)',
					type: 'user'
				}
			]
		});
	}

	async run(message, { user }) {
		await Economy.deleteMember(user.id);

		return message.say(
			new MessageEmbed()
				.setColor('RANDOM')
				.setTitle('wipe')
				.setDescription(
					`The user <@${user.id}> was successfully wiped.`
				)
				.setTimestamp()
		);
	}
};
