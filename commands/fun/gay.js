const { MessageEmbed } = require('discord.js');
const GayDB = require('./gay/gay');
const Command = require('./shared/Command');

// models

module.exports = class Gay extends Command {
    constructor(client) {
        super(client, {
            name: 'gay',
            aliases: [],
            group: 'fun',
            memberName: 'gay',
            description: 'Measures your gayness.',
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

    async run(message, { user }) {
        await GayDB.findOne(
            {
                userid: user.id
            },
            async (err, data) => {
                if (err) throw err;
                if (!data) {
                    const gayRate = Math.floor(Math.random() * 100);
                    const newData = await new GayDB({
                        name: this.client.users.cache.get(user.id).username,
                        userid: user.id,
                        gay: gayRate
                    });

                    await newData.save();

                    const embed = new MessageEmbed()
                        .setColor('#0x202225')
                        .setTitle('Bot')
                        .setDescription(
                            `User <@${
                                this.client.users.cache.get(user.id).id
                            }> is  \`${gayRate}% gay\`, <@${message.author.id}>`
                        )
                        .setTimestamp();

                    return message.say(embed);
                }
                const embed = new MessageEmbed()
                    .setColor('#0x202225')
                    .setTitle('Bot')
                    .setDescription(
                        `User <@${
                            this.client.users.cache.get(user.id).id
                        }> is  \`${data.gay}% gay\`, <@${message.author.id}>`
                    )
                    .setTimestamp();

                return message.say(embed);
            }
        );
    }
};
