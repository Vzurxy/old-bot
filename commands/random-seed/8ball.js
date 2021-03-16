const { MessageEmbed } = require('discord.js');
const Command = require('./shared/Command');
const axios = require('axios');

module.exports = class EightBallCommand extends Command {
	constructor(client) {
		super(client, {
			name: '8ball',
			aliases: ['magic-8-ball', 'eight-ball', 'magic-eight-ball'],
			group: 'random-seed',
			memberName: '8ball',
			description: 'Asks your question to the Magic 8 Ball.',
			credit: [
				{
					name: 'Mattel',
					url: 'https://www.mattel.com/en-us',
					reason: 'Original Concept',
					reasonURL:
						'https://www.mattelgames.com/games/en-us/kids/magic-8-ball'
				},
				{
					name: 'Nekos.life',
					url: 'https://nekos.life',
					reason: 'API',
					reasonURL: 'https://nekos.life/api/v2/img/8ball'
				}
			],
			args: [
				{
					key: 'question',
					prompt: 'What do you want to ask the 8 ball?',
					type: 'string',
					max: 1950
				}
			]
		});
	}

	async run(msg, { question }) {
		const imageLink = await axios
			.get('https://nekos.life/api/v2/img/8ball')
			.then(response => response.data.url);

		return msg.say(
			new MessageEmbed()
				.setColor('RANDOM')
				.setImage(imageLink)
				.setFooter(
					question,
					msg.author.avatarURL({
						format: 'png',
						dynamic: true,
						size: 1024
					})
				)
		);
	}
};
