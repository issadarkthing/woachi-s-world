import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";
import { client } from "..";
import { Prompt } from "@jiman24/discordjs-prompt";

export default class extends Command {
  name = "resetcoins";
  description = "resets coins from user";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message) {
    const prompt = new Prompt(msg);

    const confirmation = await prompt.ask(
      "You are about to reset everyone coins to zero. Proceed? [y/n]"
    );

    if (confirmation === "n") {
      throw new Error("operation cancelled");
    }

    client.players.map(player => player.coins = 0);
    msg.channel.send(`Successfully reset ${client.players.size} users`);
  }
}
