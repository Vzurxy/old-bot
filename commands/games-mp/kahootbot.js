const Command = require('./shared/Command');
const Kahoot = require('kahoot.js-updated');

module.exports = class ConnectFourCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kahootbot',
			aliases: [],
			group: 'games-mp',
			memberName: 'kahootbot',
			description: 'Play a game of Kahoot through a bot. Really buggy.',
            guildOnly: true,
            args: [
                {
					key: 'pin',
					prompt: 'Please input a kahoot game pin.',
					type: 'integer',
                },
                {
					key: 'botcount',
					prompt: 'How much bots?.',
					type: 'integer',
                },
                {
					key: 'answer',
					prompt: 'Will the bots answer randomly?',
					type: 'boolean',
                },
                {
					key: 'template',
					prompt: 'Input a name template. e.g: (Hentai => Hentai#0001, Hentai#0007...)',
					type: 'string',
                },
            ]
		});
	}

	async run(msg, { pin, botcount, answer, template }) {
        for (let i = 1; i < botcount; i++) {
            const Floyd = new Kahoot();

            Floyd.join(pin, `${template}#` + (Math.floor(Math.random() * 9999)));
    
            Floyd.on('QuestionStart', question => {
                if (answer)
                    question.answer(Math.floor(Math.random() * 4));
            });
        }

        return msg.say('Successful. Bots will invade now.')
	}
};
