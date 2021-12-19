import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { Settings } from "../structure/Settings";

export default class extends Command {
  name = "balance";
  description = "show user's balance";
  roles = [
    { name: "General Base", image: "https://cdn.discordapp.com/attachments/921963870707404881/922029367306121276/1_-_General_Base_-_3-5_coins.gif", },
    { name: "Common Male", image: "https://cdn.discordapp.com/attachments/921963870707404881/922029368526651422/2_-_Common_Male_-_10-15_coins.png", },
    { name: "Common Female", image: "https://cdn.discordapp.com/attachments/921963870707404881/922029368832839720/3_-_Common_Female_-_10-15_coins.png", },
    { name: "Uncommon Male", image: "https://cdn.discordapp.com/attachments/921963870707404881/922029368199512094/4_-_Uncommon_Male_-_25-30_coins.png", },
    { name: "Uncommon Female", image: "https://cdn.discordapp.com/attachments/921963870707404881/922029366505005086/5_-_Uncommon_Female_-_25-30_coins.png", },
    { name: "Rale Male", image: "https://cdn.discordapp.com/attachments/921963870707404881/922029367956221952/6_-_Rare_Male_-_40-50_coins.png", },
    { name: "Rare Female", image: "https://cdn.discordapp.com/attachments/921963870707404881/922029369365508116/7_-_Rare_Female_-_40-50_coins.png", },
    { name: "Common Building", image: "https://cdn.discordapp.com/attachments/921963870707404881/922029367608102922/8_-_Common_Building_-_80-90_coins.png", },
    { name: "Uncommon Building", image: "https://cdn.discordapp.com/attachments/921963870707404881/922029366882484254/9_-_Uncommon_Building_-_100-120_coins.png", },
    { name: "Rare Building", image: "https://cdn.discordapp.com/attachments/921963870707404881/922029369118031892/10_-_Rare_Building_-_140-160_coins.png", },
  ];

  async exec(msg: Message) {

    const settings = Settings.fromGuild(msg.guild!);

    if (!settings.balanceChannels.some(x => x.id === msg.channel.id)) {
      const channels = settings.balanceChannels.join(", ");

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

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(role.image)
      .addField("Name", player.name, true)
      .addField("Balance", `${player.coins} coins`, true)

    msg.channel.send({ embeds: [embed] });
  }
}
