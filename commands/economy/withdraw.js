/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
const abbreviate = require('number-abbreviate');
const Economy = require('./shared/economy');
const Command = require('./shared/Command');
const EconomyStructure = require('./shared/Economy');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'withdraw',
			aliases: ['wdraw', 'with'],
			group: 'economy',
			memberName: 'withdraw',
			description: "Withdraw's your money from your bank.",
			args: [
				{
					key: 'amount',
					prompt: 'How much?',
					type: 'string'
				}
			]
		});
	}

	async run(message, { amount }) {
		const user = message.author;
		const data = await EconomyStructure.fetchMember(user.id);

		if (!data) {
			await EconomyStructure.createMember(user.id);

			return message.say(
				new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('balance')
					.setDescription('you have nothing to withdraw!')
					.setTimestamp()
			);
		}

		if (amount === 'all' || amount === 'max') {
			amount = data.bank;
		} else {
			amount = Number(amount.replace(/,|_/g, ''));
		}

		if (data.bank - amount < 0) {
			return message.say(
				new MessageEmbed()
					.setColor('#0x202225')
					.setTitle('withdraw')
					.setDescription(
						"you don't have that much in your bank clown 🤡.'"
					)
					.setTimestamp()
			);
		}

		await Economy.updateOne(
			{ user: user.id },
			{
				money: data.money + amount,
				bank: data.bank - amount
			}
		);

		return message.say(
			new MessageEmbed()
				.setColor('RANDOM')
				.setTitle('withdraw')
				.setDescription(
					stripIndents`
                        Successfully withdrew ⏣ **${
							Number(amount) ? abbreviate(amount, 2) : 'all'
						}** cash!
                        You now have ⏣ **${
							Number(amount)
								? abbreviate(data.money + amount, 2)
								: '0'
						}** in your wallet. And ⏣ **${
						Number(amount) ? abbreviate(data.bank - amount, 2) : '0'
					}** left in your bank.
                     `
				)
				.setTimestamp()
		);
	}
};
