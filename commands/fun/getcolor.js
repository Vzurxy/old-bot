/* eslint-disable class-methods-use-this */

const Color = require("color");
const { MessageEmbed } = require("discord.js");
const Command = require("./shared/Command");

module.exports = class Gay extends Command {
  constructor(client) {
    super(client, {
      name: "getcolor",
      aliases: [],
      group: "fun",
      memberName: "getcolor",
      description: "Get's your color from a algorithm",
      args: [
        {
          key: "username",
          prompt: "Please specify a name. Leave blank for yourself.",
          type: "string",
          default: (msg) => msg.author.username,
        },
      ],
      throttling: {
        usages: 2,
        duration: 10,
      },
    });
  }

  run(message, { username }) {
    const [h, s, v] = this.genColor(username);
    const hsv = Color.hsv(h, s, v);

    return message.say(
      new MessageEmbed().setColor(hsv.round().hex()).setTitle(username)
    );
  }

  lerp(a, b, t) {
    return (b - a) * t + a;
  }

  clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  genColor(name) {
    let hash = 2166136261;
    const prime = 16777619;
    const base = 4294967296;
    const buffer = Buffer.from(name, "ascii");

    for (let i = 0; i < name.length; i += 1) {
      hash = (hash * prime) % base;
      hash = (hash + buffer[i]) % base;
    }

    const h = ((hash / 65536) % 256) / 255;
    let s = ((hash / 256) % 256) / 255;
    let v = (hash % 256) / 255;

    v = this.lerp(0.3, 1, v);
    s = this.lerp(0.5, 1, s);

    return [
      this.clamp(h * 360, 0, 360),
      this.clamp(s * 100, 0, 100),
      this.clamp(v * 100, 0, 100),
    ];
  }
};
