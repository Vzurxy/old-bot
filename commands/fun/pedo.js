const { MessageEmbed } = require('discord.js');
const PedoDB = require('./pedo/pedo');
const Command = require('./shared/Command');

module.exports = class Pedo extends Command {
    constructor(client) {
        super(client, {
            name: 'pedo',
            aliases: [],
            group: 'fun',
            memberName: 'pedo',
            description: 'Measures your pedoness.',
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
        const member = message.guild.member(user);

        if (
            member.displayName.search('builder') !== -1 ||
            member.displayName.search('baby shark') !== -1
        ) {
            return message.say(
                new MessageEmbed()
                    .setColor('#0x202225')
                    .setTitle('Bot')
                    .setDescription(`You are \`∞% pedo\`, builder. 😎😂`)
                    .setTimestamp()
            );
        }

        return PedoDB.findOne(
            {
                userid: user.id
            },
            async (err, data) => {
                if (err) throw err;
                if (!data) {
                    const pedoRate = Math.floor(Math.random() * 100);
                    const newData = await new PedoDB({
                        name: this.client.users.cache.get(user.id).username,
                        userid: user.id,
                        pedo: pedoRate
                    });

                    await newData.save();

                    const embed = new MessageEmbed()
                        .setColor('#0x202225')
                        .setTitle('Bot')
                        .setDescription(
                            `User <@${
                                this.client.users.cache.get(user.id).id
                            }> is  \`${pedoRate}% pedo\`, <@${
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
                        }> is  \`${data.pedo}% pedo\`, <@${message.author.id}>`
                    )
                    .setTimestamp();

                return message.say(embed);
            }
        );
    }
};
