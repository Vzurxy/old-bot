const { MessageEmbed } = require('discord.js');
const abbreviate = require('number-abbreviate');
const Economy = require('./shared/economy');
const Command = require('./shared/Command');
const EconomyStructure = require('./shared/Economy');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deposit',
			aliases: ['dep'],
			group: 'economy',
			memberName: 'deposit',
			description: "Deposit's your money into a bank.",
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
					.setDescription(`You have nothing to deposit!`)
					.setTimestamp()
			);
		}

		if (amount === 'all' || amount === 'max') {
			amount = data.money;
		} else {
			amount = Number(amount.replace(/,|_/g, ''));
		}

		if (!amount) {
			return message.say(
				'Please enter a valid number! Can contain commas and underscores and e.'
			);
		}

		if (data.money - amount < 0) {
			return message.say(
				new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('balance')
					.setDescription(
						`you don't have that much in your wallet clown 🤡.`
					)
					.setTimestamp()
			);
		}

		await Economy.updateOne(
			{ user: user.id },
			{
				money: data.money - amount,
				bank: data.bank + amount
			}
		);

		return message.say(
			new MessageEmbed()
				.setColor('RANDOM')
				.setTitle('balance')
				.setDescription(
					amount === 'all' || amount === 'max'
						? `Successfully deposited **all** cash! You now have ⏣ **${abbreviate(
								data.bank + data.money,
								2
						  )}** in your bank.`
						: `Successfully deposited ⏣ **${abbreviate(
								amount,
								2
						  )}** cash! You now have ⏣ **${abbreviate(
								data.bank + amount,
								2
						  )}** in your bank.`
				)
				.setTimestamp()
		);
	}
};
