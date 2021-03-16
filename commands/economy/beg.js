/* eslint-disable class-methods-use-this */

const Results = require('./beg/begresult');
const Names = require('./beg/names');
const Command = require('./shared/Command');
const Economy = require('./shared/Economy');
const { randomRange } = require('./shared/util');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'beg',
			aliases: [],
			group: 'economy',
			throttling: { usages: 1, duration: 30 },
			memberName: 'beg',
			description: 'Beg for some coins'
		});
	}

	async run(message) {
		const user = message.author;
		const randomName = Names[Math.floor(Math.random() * Names.length)];
		const success = randomRange(1, 10) < 6;

		if (success) {
			const moneyRange = randomRange(20, 500);
			const randomSuccess =
				Results.success[
					Math.floor(Math.random() * Results.success.length)
				];
			message.reply(
				`**${randomName}** ${randomSuccess}. ⏣ ${moneyRange} received.`
			);

			const existingData = await Economy.fetchMember(user.id);
			if (!existingData) {
				const data = Economy.createMember(user.id);
				data.money += moneyRange;

				await data.save();
			} else {
				await Economy.addMoney(user.id, moneyRange);
			}
		} else {
			const randomFailure =
				Results.failure[
					Math.floor(Math.random() * Results.failure.length)
				];
			message.reply(`**${randomName}** ${randomFailure}.`);
		}
	}
};
