const Command = require('./shared/Command');

const fs = require('fs');
const path = require('path');
const request = require('request');
const Fluent = require('fluent-ffmpeg');

const download = (url, dir, callback) => {
	request.head(url, () => {
		request(url).pipe(fs.createWriteStream(dir)).on('close', callback);
	});
};

module.exports = class CheckCrash extends Command {
	constructor(client) {
		super(client, {
			name: 'checkcrash',
			aliases: ['ccrash'],
			group: 'other',
			memberName: 'checkcrash',
			description: "Check's if the video url is a crasher.",
			details: 'Fart.',
			args: [
				{
					key: 'url',
					prompt: 'Send a valid video url.',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { url }) {
		const directory = `${__dirname}\\video${path.extname(url)}`;
		console.log(directory);

		await download(url, directory, async () => {
			const ff = new Fluent();
			await ff
				.on('error', () => {
					msg.react('✅');
				})
				.addInput(directory)
				.addInputOption('-xerror')
				.addInputOption('-v error')
				.output('-')
				.outputOptions('-f null')
				.run();
		});
	}
};
