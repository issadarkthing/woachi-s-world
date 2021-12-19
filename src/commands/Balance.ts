import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";


export default class extends Command {
  name = "balance";
  description = "show user's balance";

  async exec(msg: Message) {

    const player = Player.fromUser(msg.author);

    msg.channel.send(`Your balance is ${player.coins} coins`);
  }
}
