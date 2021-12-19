import { Command } from "@jiman24/commandment";
import { Prompt } from "@jiman24/discordjs-prompt";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { Settings } from "../structure/Settings";

export default class extends Command {
  name = "text";
  description = "store any custom text";

  async exec(msg: Message, args: string[]) {

    const prompt = new Prompt(msg);
    const settings = Settings.fromGuild(msg.guild!);

    if (!settings.textChannels.some(x => x.id === msg.channel.id)) {
      const channels = settings.textChannels.join(", ");

      throw new Error(
        `this command only works in this channel(s) ${channels}`
      );
    }

    const player = Player.fromUser(msg.author);

    if (args[0] === "show") {
      msg.channel.send("This is your custom text:");
      msg.channel.send(player.customText);
      return;
    }

    const text = await prompt.ask("Enter a custom text");

    player.customText = text;

    player.save();

    msg.channel.send("Successfully saved custom text");
    const { prefix } = this.commandManager;
    msg.channel.send(`To see your custom text use \`${prefix}${this.name} show\``);
  }
}
