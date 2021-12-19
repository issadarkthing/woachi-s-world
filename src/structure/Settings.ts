import { Guild, GuildChannelManager, TextBasedChannels } from "discord.js";
import { client } from "../index";

export class SettingsError extends Error {};


interface Options {
  guild: Guild;
  playChannels: TextBasedChannels[];
  textChannels: TextBasedChannels[];
  balanceChannels: TextBasedChannels[];
  logChannels: TextBasedChannels[];
}


export class Settings {
  readonly guild: Guild;
  playChannels: TextBasedChannels[];
  textChannels: TextBasedChannels[];
  balanceChannels: TextBasedChannels[];
  logChannels: TextBasedChannels[];

  constructor(opts: Options) {
    this.guild = opts.guild;
    this.playChannels = opts.playChannels;
    this.textChannels = opts.textChannels;
    this.balanceChannels = opts.balanceChannels;
    this.logChannels = opts.logChannels;
  }

  private static getChannels(
    ids: string[], 
    channels: GuildChannelManager,
  ): TextBasedChannels[] {

    const ch = channels.cache
      .filter(channel => ids.includes(channel.id))
      .filter(channel => channel.isText())
      .values();

    return [...ch] as TextBasedChannels[];
  }

  private static getChannelByName(
    name: string, 
    channels: GuildChannelManager,
    data: any,
  ): TextBasedChannels[] {

    const chans = this.getChannels(data[`${name}Channels`], channels);
    if (chans.length < 1) {
      throw new SettingsError(`no ${name} channel was chosen`);
    }

    return chans;
  }

  static fromGuild(guild: Guild) {

    const data = client.settings.get(guild.id);

    if (!data) {
      throw new SettingsError("guild settings has not been configured");
    }

    const playChannels = this.getChannelByName("play", guild.channels, data);
    const textChannels = this.getChannelByName("text", guild.channels, data);
    const balanceChannels = this.getChannelByName("balance", guild.channels, data);
    const logChannels = this.getChannelByName("log", guild.channels, data);

    return new Settings({
      guild,
      playChannels,
      textChannels,
      balanceChannels,
      logChannels,
    });
  }

  save() {

    const guildID = this.guild.id;
    const playChannels = this.playChannels.map(x => x.id);
    const textChannels = this.textChannels.map(x => x.id);
    const balanceChannels = this.balanceChannels.map(x => x.id);
    const logChannels = this.logChannels.map(x => x.id);

    client.settings.set(this.guild.id, {
      guildID,
      playChannels,
      textChannels,
      balanceChannels,
      logChannels,
    });
  }
}
