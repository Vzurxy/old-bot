/* eslint-disable */

const levenshtein = require('js-levenshtein');
const Command = require('./shared/Command');

const db = require('./shared/tags');

module.exports = class Tag extends Command {
    constructor(client) {
        super(client, {
            name: 'tag',
            aliases: ['t'],
            group: 'fun',
            memberName: 'tag',
            description: 'Gets a tag',
            args: [
                {
                    key: 'tag',
                    prompt: 'Please specify a tag!',
                    type: 'string'
                }
            ],
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }

    async run(message, { tag }) {
        const trollEmoji = this.client.emojis.cache.get('789234143158468608');
        await db.findOne(
            { guild: message.guild.id, tag },
            async (err, data) => {
                if (err) throw err;
                if (data) {
                    message.say(data.content);
                } else {
                    message.say(
                        'No tag was found. Do you want to get the closest match? y/n'
                    );

                    const collector = message.channel.createMessageCollector(
                        (m) => {
                            return message.author.id === m.author.id;
                        },
                        { time: 20000 }
                    );

                    collector.on('collect', (m) => {
                        if (m.content === 'yes' || m.content === 'y') {
                            const tags = [];
                            const closest = [];

                            db.find(
                                { guild: message.guild.id },
                                (errtwo, datatwo) => {
                                    if (err) throw errtwo;
                                    if (datatwo) {
                                        for (
                                            let length = 0;
                                            length < datatwo.length;
                                            length++
                                        ) {
                                            tags.push(datatwo[length].tag);
                                        }

                                        for (
                                            let index = 0;
                                            index < tags.length;
                                            index++
                                        ) {
                                            const ntag = tags[index];
                                            closest.push({
                                                name: ntag,
                                                dist: levenshtein(ntag, tag)
                                            });
                                        }

                                        closest.sort(function (a, b) {
                                            return a.dist - b.dist;
                                        });

                                        const result = closest.slice(0, 5);
                                        let resarr = '';

                                        for (
                                            let length = 0;
                                            length < result.length;
                                            length++
                                        ) {
                                            const dict = result[length];
                                            resarr += `${length + 1} \`${
                                                dict.name
                                            }\` LV Distance: ${dict.dist} \n`;
                                        }

                                        message.reply(
                                            `Please select a tag number.\n${resarr}`
                                        );

                                        const collector = message.channel.createMessageCollector(
                                            (m) => {
                                                return (
                                                    message.author.id ===
                                                    m.author.id
                                                );
                                            },
                                            { time: 20000 }
                                        );

                                        let errorTest = 1;

                                        collector.on('collect', (m) => {
                                            if (!Number(m.content)) {
                                                if (errorTest === 3) {
                                                    m.react(trollEmoji);
                                                    collector.stop('troll');
                                                } else {
                                                    message.reply(
                                                        'Please send a valid number.'
                                                    );
                                                    errorTest++;
                                                }
                                            } else {
                                                const tagName =
                                                    result[
                                                        Number(m.content - 1)
                                                    ];
                                                if (tagName) {
                                                    db.findOne(
                                                        {
                                                            guild:
                                                                message.guild
                                                                    .id,
                                                            tag: tagName.name
                                                        },
                                                        async (err, data) => {
                                                            if (err) throw err;
                                                            if (data) {
                                                                message.say(
                                                                    data.content
                                                                );
                                                            }
                                                        }
                                                    );
                                                    collector.stop('finished');
                                                } else if (errorTest === 3) {
                                                    m.react(trollEmoji);
                                                    collector.stop('troll');
                                                } else {
                                                    message.reply(
                                                        'Please send a valid number 1-5.'
                                                    );
                                                    errorTest++;
                                                }
                                            }
                                        });
                                    }
                                }
                            );
                            collector.stop('finished');
                        } else if (m.content === 'no' || m.content === 'n') {
                            collector.stop('cancel');
                        }
                    });
                }
            }
        );
    }
};
