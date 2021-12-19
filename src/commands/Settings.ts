import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed, PermissionResolvable, TextBasedChannels } from "discord.js";
import { Prompt } from "@jiman24/discordjs-prompt";
import { Settings } from "../structure/Settings";

export default class extends Command {
  name = "settings";
  description = "set server's settings";
  permissions = ["ADMINISTRATOR"] as PermissionResolvable[];

  private async getChannel(name: string, prompt: Prompt) {

    const collected = await prompt.collect(
      `Please mention which channel(s) to be used for ${name}`
    );

    const channel = collected.mentions.channels;

    if (channel.size < 1) {
      throw new Error(`No channel was mentioned for ${name}`);
    }

    const nonTextChannel = channel.find(x => !x.isText);

    if (nonTextChannel) {
      throw new Error(`${nonTextChannel} is not a text channel`);
    }

    return [...channel.values()] as TextBasedChannels[];
  }

  private show(settings: Settings) {

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .addField("Play Channel", settings.playChannels.join(", "), true)
      .addField("Text Channel", settings.textChannels.join(", "), true)
      .addField("Balance Channel", settings.balanceChannels.join(", "), true)
      .addField("Log Channel", settings.logChannels.join(", "), true)

    return embed;
  }

  async exec(msg: Message, args: string[]) {

    const prompt = new Prompt(msg);
    const guild = msg.guild;

    if (!guild) {
      throw new Error("this command only work in server");
    }

    if (args[0] === "show") {
      const settings = Settings.fromGuild(msg.guild);
      const embed = this.show(settings);
      msg.channel.send({ embeds: [embed] });
      return;
    }

    const playChannels = await this.getChannel("play", prompt);
    const textChannels = await this.getChannel("text", prompt);
    const balanceChannels = await this.getChannel("balance", prompt);
    const logChannels = await this.getChannel("log", prompt);

    const settings = new Settings({
      guild,
      playChannels,
      textChannels,
      balanceChannels,
      logChannels,
    });

    settings.save();

    msg.channel.send("Settings saved");

    const prefix = this.commandManager.prefix;
    msg.channel.send(`To see your settings use \`${prefix}${this.name} show\``)
  }
}
