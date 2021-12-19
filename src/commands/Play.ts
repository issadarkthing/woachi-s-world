import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { Settings } from "../structure/Settings";
import { random } from "@jiman24/discordjs-utils";
import { Prompt } from "@jiman24/discordjs-prompt";


export default class extends Command {
  name = "play";
  description = "earn money";
  settings!: Settings;
  roles = [
    { name: "General Base", min: 3, max: 5, },
    { name: "Common Male", min: 10, max: 15, },
    { name: "Common Female", min: 10, max: 15, },
    { name: "Uncommon Male", min: 25, max: 30, },
    { name: "Uncommon Female", min: 25, max: 30, },
    { name: "Rale Male", min: 40, max: 50, },
    { name: "Rare Female", min: 40, max: 50, },
    { name: "Common Building", min: 80, max: 90, },
    { name: "Uncommon Building", min: 100, max: 120, },
    { name: "Rare Building", min: 140, max: 160, },
  ];

  log(text: string) {
    this.settings.logChannels.forEach(channel => {
      channel.send(text);
    })
  }

  async exec(msg: Message) {

    const prompt = new Prompt(msg);
    const settings = Settings.fromGuild(msg.guild!);
    this.settings = settings;

    if (!settings.playChannels.some(x => x.id === msg.channel.id)) {
      const channels = settings.playChannels.join(", ");

      throw new Error(
        `this command only works in this channel(s) ${channels}`
      );
    }

    const player = Player.fromUser(msg.author);
    const role = this.roles
      .find(x => msg.member?.roles.cache.find(role => role.name === x.name));

    if (!role) {
      throw new Error("You do not have any objects in the collection");
    }

    const {min, max} = role;
    const amount = random.integer(min, max);

    player.playCommandUses++;

    const playCommandPay = 10;

    if (player.playCommandUses > 4) {

      const confirmation = await prompt.ask(
        `Your play command has reached 4 uses. 10 coins needed to continue. Proceed? [y/n]`
      );

      if (confirmation === "n") {
        throw new Error("play command failed");
      }

      if (player.coins < playCommandPay) {
        throw new Error("insufficient balance");
      }

      player.playCommandUses = 0;
      player.coins -= playCommandPay;
      msg.channel.send(`${playCommandPay} coins have been deducted`);
      this.log(`${playCommandPay} coins have been deducted from ${player.name}`);
    }

    player.coins += amount;
    player.save();

    msg.channel.send(`You've earned ${amount} coins`);
    this.log(`${player.name} has earned ${amount} coins`);
  }
}
