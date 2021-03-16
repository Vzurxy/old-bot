/* eslint-disable class-methods-use-this */

const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
const Command = require('./shared/Command');
const Economy = require('./shared/Economy');
const abbreviate = require('number-abbreviate');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'balance',
			aliases: ['bal'],
			group: 'economy',
			memberName: 'balance',
			description: "Show's your balance or another user's balance",
			args: [
				{
					key: 'user',
					prompt: 'Which member? (@)',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(message, { user }) {
		const data = await Economy.fetchMember(user.id);
		if (!data) {
			Economy.createMember(user.id);

			return message.say(
				new MessageEmbed()
					.setColor('RANDOM')
					.setTitle(`${user.username}'s balance`)
					.setDescription(
						stripIndents`
                            **wallet**: ⏣ 0
                            **bank**: ⏣ 0
                        `
					)
					.setFooter('🏦')
			);
		}

		const { money, bank } = data;

		return message.say(
			new MessageEmbed()
				.setColor('RANDOM')
				.setTitle(`${user.username}'s balance`)
				.setDescription(
					stripIndents`
                    **wallet**: ⏣ ${
						money === Infinity ? '∞' : abbreviate(money)
					}
                    **bank**: ⏣ ${bank === Infinity ? '∞' : abbreviate(bank)}
                 `
				)
				.setFooter('🏦')
		);
	}
};
