import { CommandManager } from "@jiman24/commandment";
import { Client as DiscordClient } from "discord.js";
import Enmap from "enmap";

export class Client extends DiscordClient {
  settings = new Enmap("settings");
  players = new Enmap("player");
  commandManager = new CommandManager(process.env.PREFIX || "!");
}
