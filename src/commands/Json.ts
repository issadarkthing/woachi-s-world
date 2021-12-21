import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";
import { client } from "..";
import { writeFileSync } from "fs";
import path from "path";

export default class extends Command {
  name = "json";
  description = "returns json file with all the data";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message) {

    let data = {} as any;
    const players = client.players.fetchEverything();
    const jsonPath = path.resolve("./data/data.json");

    for (const [key, value] of players) {
      data[key] = value;
    }

    data = JSON.stringify(data);

    writeFileSync(jsonPath, data);

    msg.channel.send({ files: [jsonPath] });
  }
}
