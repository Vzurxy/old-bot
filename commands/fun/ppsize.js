const { MessageEmbed } = require('discord.js');
const SizeDB = require('./ppsize/size');
const Command = require('./shared/Command');

const sizes = [
    'Atomic',
    'Micro',
    'Tiny',
    'Small',
    'Average',
    'Medium',
    'Big',
    'Humoungous',
    'Godlike',
    'ULTRA GODLY'
];

const emotes = [
    '🤢',
    '😞😫',
    '😫',
    '😥',
    '😒',
    '🙂',
    '🤭',
    '😘',
    '🥵🍑',
    '😈🍆🥵💦'
];

function sizeToEmote(size) {
    const index = sizes.indexOf(size);
    return emotes[index];
}

module.exports = class PPSizeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ppsize',
            aliases: ['size'],
            group: 'fun',
            memberName: 'ppsize',
            description: 'Measures your pp.',
            args: [
                {
                    key: 'user',
                    prompt: 'Which member? (@)',
                    type: 'user',
					default: (msg) => msg.author
                }
            ],
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }

    run(message, { user }) {
        const index = Math.floor(Math.random() * sizes.length);
        const sizenew = sizes[index];
		
        SizeDB.findOne(
            {
                userid: user.id
            },
            async (err, data) => {
                if (err) throw err;
                if (!data) {
                    const newData = new SizeDB({
                        name: this.client.users.cache.get(user.id).username,
                        userid: user.id,
                        size: sizenew
                    });

                    await newData.save();

                    return newData;
                }
                const { size } = data;
                const emote = sizeToEmote(size);
                const ascii = '='.repeat(Math.abs(sizes.indexOf(size) - 2));

                const embed = new MessageEmbed()
                    .setColor('#0x202225')
                    .setTitle('Bot')
                    .setDescription(
                        `User <@${
                            this.client.users.cache.get(user.id).id
                        }> has  \`${size} PP 8${ascii}>\`, <@${
                            message.author.id
                        }>`
                    )
                    .setTimestamp()
                    .setFooter(`${emote}`);

                return message.say(embed);
            }
        );
    }
};
