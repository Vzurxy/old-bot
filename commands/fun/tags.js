const { MessageEmbed } = require('discord.js');
const db = require('./shared/tags');
const Command = require('./shared/Command');

let page = 0;

module.exports = class Tags extends Command {
    constructor(client) {
        super(client, {
            name: 'tags',
            aliases: [],
            group: 'fun',
            memberName: 'tags',
            description: 'Lists all tags',
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }

    async run(message) {
        const tags = [];

        db.find({ guild: message.guild.id }, (err, data) => {
            if (err) throw err;
            if (data) {
                if (!data.length >= 20) {
                    for (let length = 0; length < data.length; length++) {
                        tags.push(data[length].tag);
                    }

                    const tagres = `\`${tags.join('`, `')}\``;

                    const embed = new MessageEmbed()
                        .setColor('#0x202225')
                        .setTitle('Bot')
                        .setDescription(tagres)
                        .setTimestamp();

                    message.say(embed);
                } else {
                    this.cdata = data;

                    const max = page * 20 + (this.cdata.length - page * 20);
                    const npages = Math.ceil(max / 20);

                    const start = [];
                    for (let length = 0; length < 20; length++) {
                        if (data[length]) {
                            start.push(data[length].tag);
                        }
                    }

                    const tagres = `\`${start.join('`, `')}\``;

                    const embed = new MessageEmbed()
                        .setColor('#0x202225')
                        .setDescription(tagres)
                        .setFooter(`Page ${page + 1} of ${npages}`);

                    message.say(embed).then((msg) => {
                        msg.react('⬅️').then(() => {
                            msg.react('➡️');

                            const backwardsFilter = (reaction, user) =>
                                reaction.emoji.name === '⬅️' &&
                                user.id === message.author.id;
                            const forwardsFilter = (reaction, user) =>
                                reaction.emoji.name === '➡️' &&
                                user.id === message.author.id;

                            const backwards = msg.createReactionCollector(
                                backwardsFilter,
                                { time: 60000 }
                            );
                            const forwards = msg.createReactionCollector(
                                forwardsFilter,
                                { time: 60000 }
                            );

                            backwards.on('collect', () => {
                                if (page === 0) {
                                    msg.reactions
                                        .resolve('⬅️')
                                        .users.remove(message.author.id);
                                    return;
                                }

                                page--;

                                if (page === 0) {
                                    const min = page * 20;
                                    const max = 20;

                                    const procdata = this.cdata.slice(min, max);
                                    const data = [];

                                    for (
                                        let idx = 0;
                                        idx < procdata.length;
                                        idx++
                                    ) {
                                        data.push(procdata[idx].tag);
                                    }

                                    const tagres = `\`${data.join('`, `')}\``;

                                    embed.setDescription(tagres);
                                    embed.setFooter(
                                        `Page ${page + 1} of ${npages}`
                                    );
                                    msg.edit(embed);
                                } else {
                                    const min = page * 20;
                                    const max =
                                        page * 20 +
                                        (this.cdata.length - page * 20);

                                    const procdata = this.cdata.slice(min, max);
                                    const data = [];

                                    for (
                                        let idx = 0;
                                        idx < procdata.length;
                                        idx++
                                    ) {
                                        data.push(procdata[idx].tag);
                                    }

                                    const tagres = `\`${data.join('`, `')}\``;

                                    embed.setDescription(tagres);
                                    embed.setFooter(
                                        `Page ${page + 1} of ${npages}`
                                    );
                                    msg.edit(embed);
                                }

                                msg.reactions
                                    .resolve('⬅️')
                                    .users.remove(message.author.id);
                            });

                            forwards.on('collect', () => {
                                if (page === npages - 1) {
                                    msg.reactions
                                        .resolve('➡️')
                                        .users.remove(message.author.id);
                                    return;
                                }

                                page++;

                                const min = page * 20;
                                const max =
                                    page * 20 + (this.cdata.length - page * 20);

                                const procdata = this.cdata.slice(min, max);
                                const data = [];

                                for (
                                    let idx = 0;
                                    idx < procdata.length;
                                    idx++
                                ) {
                                    data.push(procdata[idx].tag);
                                }

                                const tagres = `\`${data.join('`, `')}\``;

                                embed.setDescription(tagres);
                                embed.setFooter(
                                    `Page ${page + 1} of ${npages}`
                                );
                                msg.edit(embed);

                                msg.reactions
                                    .resolve('➡️')
                                    .users.remove(message.author.id);
                            });
                        });
                    });
                }
            }
        });
    }
};
