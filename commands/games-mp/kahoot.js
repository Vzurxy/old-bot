const Command = require('./shared/Command');
const Kahoot = require('kahoot.js-updated');

module.exports = class ConnectFourCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kahoot',
			aliases: [],
			group: 'games-mp',
			memberName: 'kahoot',
			description: 'Play a game of Kahoot through a bot. Really buggy.',
            guildOnly: true,
            args: [
                {
					key: 'pin',
					prompt: 'Please input a kahoot game pin.',
					type: 'integer',
				}
            ]
		});
	}

	async run(msg, { pin }) {
        const Floyd = new Kahoot();

        Floyd.join(pin, 'George Floyd #' + (Math.floor(Math.random() * 9999)));

        Floyd.on('Joined', () => {
            msg.say('Successfully joined kahoot game!')
        });

        Floyd.on('QuestionStart', async question => {
            message.say('A new question has started, what do you pick?');
            message.say('0: <:red:795432407091511327> red\n 1: <:blue:795432471377739806> blue\n 2: <:yellow:795432438389014528> yellow\n 3: <:green:795432462825160786> green')
            
            const filter = res => {
				const num = res.content
                return (num >= '0' && num <= '3');
            };
            
			const option = await msg.channel.awaitMessages(filter, {
				max: 1,
				time: question.timeAvailable
            });
            
            if (!option.size) {
                message.say('Picking random...')
                question.answer(Math.floor(Math.random() * 4));
            } else {
                question.answer(Numbeer(option.first().content));
            }
        });

        //client.on('QuestionStart', question => {
        //console.log('A new question has started, answering the first answer.');
        //question.answer(0);
	}
};
