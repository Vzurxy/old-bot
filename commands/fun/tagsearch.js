/* eslint-disable class-methods-use-this */

const { MessageEmbed } = require('discord.js');
const levenshtein = require('js-levenshtein');
const Tags = require('./shared/tags');
const Command = require('./shared/Command');

module.exports = class TagSearch extends Command {
    constructor(client) {
        super(client, {
            name: 'tagsearch',
            aliases: ['tagse', 'searchtag', 'stag'],
            group: 'fun',
            memberName: 'tagsearch',
            description: 'Lists all tags',
            args: [
                {
                    key: 'tag',
                    prompt: 'Please specify a tag to search for!',
                    type: 'string'
                }
            ],
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }

    run(message, { tag }) {
        const tags = [];
        const closest = [];

        Tags.find({ guild: message.guild.id }, (err, data) => {
            if (err) throw err;
            if (data) {
                for (let length = 0; length < data.length; length += 1) {
                    tags.push(data[length].tag);
                }

                for (let index = 0; index < tags.length; index += 1) {
                    const ntag = tags[index];
                    closest.push({
                        name: ntag,
                        dist: levenshtein(ntag, tag)
                    });
                }

                closest.sort((a, b) => {
                    return a.dist - b.dist;
                });

                const result = closest.slice(0, 5);
                let resarr = '';

                for (let length = 0; length < result.length; length += 1) {
                    const dict = result[length];
                    resarr += `\`${dict.name}\` LV Distance: ${dict.dist} \n`;
                }

                const embed = new MessageEmbed()
                    .setColor('#0x202225')
                    .setTitle('Bot')
                    .setDescription(`\n${resarr}`)
                    .setTimestamp();

                message.reply(embed);
            }
        });
    }
};
