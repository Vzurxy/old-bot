/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

const { MessageEmbed } = require('discord.js');
const abbreviate = require('number-abbreviate');
const Command = require('./shared/Command');
const Economy = require('./shared/Economy');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'changebalance',
			aliases: ['changebal', 'balchange', 'balancechange'],
			group: 'economy',
			memberName: 'changebalance',
			description: 'Bot owner only. Changes other people money.',
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'user',
					prompt: 'Which member? (@)',
					type: 'user'
				},
				{
					key: 'amount',
					prompt: 'How much?',
					type: 'string'
				}
			]
		});
	}

	async run(message, { user, amount }) {
		amount = Number(amount.replace(/,|_/g, ''));
		if (Number.isNaN(amount)) {
			return message.reply('invalid value, please use a number.');
		}

		const userData = await Economy.fetchMember(user.id);
		await Economy.addMoney(user.id, amount);

		return message.say(
			new MessageEmbed()
				.setColor('RANDOM')
				.setTitle('balance')
				.setDescription(
					`Successfully ${amount > 0 ? 'gave' : 'took away'} user <@${
						user.id
					}> ⏣ **${abbreviate(
						amount
					)}**. They now have ⏣ **${abbreviate(
						userData.money + amount
					)}**.`
				)
				.setTimestamp()
		);
	}
};
