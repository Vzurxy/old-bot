const Command = require('./shared/Command');
const { stripIndents } = require('common-tags');
const Sauce = require('saucenao-parser');

const sauce = new Sauce({
	api_key: 'b8e1d3d73bb8504f43cc7f88e66f159f65855ef0'
});

sauce.setOptions({
	numres: 1
});

module.exports = class WhatAnimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'saucenao',
			group: 'analyze',
			memberName: 'saucenao',
			description: 'Searches a image with saucenao.',
			credit: [
				{
					name: 'SauceNAO',
					url: 'https://saucenao.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'screenshot',
					prompt: 'Use a image to scan.',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { screenshot }) {
		try {
			const result = await this.search(screenshot, msg.channel.nsfw);
			if (result === 'size') {
				return msg.reply(
					'Please do not send an image larger than 10MB.'
				);
			}
			if (result === 'NO_RESULT') {
				return msg.reply('There was no result.');
			}

			const title = `${result.title}`;
			return msg.reply(
				stripIndents`
                I'm ${result.prob}% sure this is from ${title} Episode ${
					result.episode
				}. This was aired from ${result.year}.
                More info: ${result.ext_url}
				${
					result.prob < 70
						? '_This probablity is rather low, try using a higher quality image._'
						: ''
				}
			`,
				result.preview
					? {
						files: [
								{
									attachment: result.preview,
									name: 'preview.png'
								}
							]
					  }
					: {}
			);
		} catch (err) {
			return msg.reply(
				`Oh no, an error occurred: \`${err.message}\`. Try again later!`
			);
		}
	}

	async search(file) {
		if (Buffer.byteLength(file) > 1e7) return 'size';

		let data = await sauce.getSauce(file).then(response => {
			const result = response.results[0];
			if (Object.keys(result.data).length == 0) return 'NO_RESULT';

			return {
				prob: result.header.similarity,
				title: result.data.title,
				preview: result.header.thumbnail,
				year: result.data.year
					? result.data.year.length == '5'
						? result.data.year + new Date().getFullYear()
						: result.year
					: '????-????',
				episode: result.data.part ? result.data.part : '?',
				ext_url: result.data.ext_urls[0]?.url || 'None'
			};
		});

		return data;
	}
};
