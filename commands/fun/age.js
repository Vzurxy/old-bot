const { MessageEmbed } = require('discord.js');
const Ages = require('./age/age');
const Command = require('./shared/Command');

module.exports = class Age extends Command {
    constructor(client) {
        super(client, {
            name: 'age',
            aliases: [],
            group: 'fun',
            memberName: 'age',
            description: 'Measures your age.',
            args: [
                {
                    key: 'user',
                    prompt: 'Which member?',
                    type: 'user'
                }
            ],
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }

    run(message, { user }) {
        Ages.findOne(
            {
                userid: user.id
            },
            async (err, data) => {
                if (err) throw err;
                if (!data) {
                    const age = Math.floor((Math.random() * 100) / 1.5);
                    const newData = await new Ages({
                        name: this.client.users.cache.get(user.id).username,
                        userid: user.id,
                        age
                    });

                    await newData.save();

                    const embed = new MessageEmbed()
                        .setColor('#0x202225')
                        .setTitle('Bot')
                        .setDescription(
                            `User <@${
                                this.client.users.cache.get(user.id).id
                            }> is  \`${age} years old.\` <@${
                                message.author.id
                            }>`
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
                        }> is  \`${data.age} years old.\` <@${
                            message.author.id
                        }>`
                    )
                    .setTimestamp();

                return message.say(embed);
            }
        );
    }
};
