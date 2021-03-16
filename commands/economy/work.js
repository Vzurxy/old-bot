/* eslint-disable class-methods-use-this */

const ms = require('parse-ms');
const Economy = require('./shared/economy');
const Command = require('./shared/Command');
const Work = require('./work/Work');
const { randomRange } = require('./shared/util');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'work',
			aliases: [],
			group: 'economy',
			throttling: { usages: 1, duration: 300 },
			memberName: 'work',
			description: 'A gateway to work commands.',
			args: [
				{
					key: 'option',
					prompt:
						'Pick a option. (list = work list, [name] = apply to job, [none] = work as current job)',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(message, { option }) {
		const { author } = message.author;
		const data = await this.getEconomy(author);
		switch (option) {
			case '':
				if (data.work === 'none') {
					return message.reply(
						'you have no job idiot. use ?work list for a list of jobs.'
					);
				}

				return this.randomWorkAssignment(data.work, author, message);
			case 'list':
				return message.reply(Object.values(Work));
			case 'leave':
				await Economy.updateOne(
					{ userid: author.id },
					{
						work: 'none',
						lastleft: Date.now()
					}
				);

				return message.reply('left');
			case 'info':
				return message.reply(`your current job is ${data.work}.`);
			default:
				if (data.work !== 'none') {
					return message.reply(
						'please resign your current job with ?work leave'
					);
				}

				if (
					Work.includes(option[0].toUpperCase() + option.substring(1))
				) {
					if (
						data.lastleft &&
						43200000 - (Date.now() - data.lastleft) > 0
					) {
						const time = ms(43200000 - (Date.now() - data.daily));

						return message.reply(
							`you need to wait\n
							${time.hours}h\`, \`${time.minutes}m\`, and \`${time.seconds}s after leaving a job recently.`
						);
					}

					await Economy.updateOne(
						{ userid: author.id },
						{
							work: option[0].toUpperCase() + option.substring(1)
						}
					);
					return message.reply(`successfully applied for the job.`);
				}

				return 'WORK_FINISHED';
		}
	}

	static getEconomy(user) {
		return Economy.findOne({ userid: user.id }, async (err, data) => {
			if (err) throw err;
			if (!data) {
				const newEconomy = new Economy({
					name: user.username,
					userid: user.id,
					wallet: 0,
					bank: 0,
					work: 'none'
				});

				await newEconomy.save();
				return newEconomy;
			}

			return data;
		});
	}

	async randomWorkAssignment(job, author, message) {
		const moneyReceived = randomRange(2500, 3000);
		const data = await this.getEconomy(author);
		await Economy.updateOne(
			{ userid: author.id },
			{
				wallet: data.wallet + moneyReceived
			}
		);
		message.reply(`you work as a ${job} you earn ⏣ ${moneyReceived}.`);
	}
};
