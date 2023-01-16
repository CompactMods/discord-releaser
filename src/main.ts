import * as core from '@actions/core'
import { DiscordModFileUploader, ModFileMetadata } from './discord'
import { stat } from "fs/promises";
import { Stats } from 'fs';

async function run(): Promise<void> {
  const filename: string = core.getInput('filename');
  const channelId: string = core.getInput('channel');

  let fileStats: Stats;
  try { fileStats = await stat(filename); }
  catch {
    core.error("File not found; cannot continue.");
    core.setFailed("Error reading file stats.");
    return;
  }

  let thumbnail = core.getInput("thumbnail");
  const fileSize = (fileStats.size / (1024 * 1000)).toFixed(2);
  const meta: ModFileMetadata = {
    modName: core.getInput("modName", { required: true }),
    modVersion: core.getInput("modVersion", { required: true }),
    fileSize: `${fileSize} MB`,

    mcVersion: core.getInput("mcVersion"),
    forgeVersion: core.getInput("forgeVersion")
  };

  try {
    core.debug(`Sending information about file ${filename} to ${channelId} ...`);

    var uploader = DiscordModFileUploader.forFile(filename)
      .channel(channelId)
      .metadata(meta);

    if (thumbnail)
      uploader = uploader.thumbnail(thumbnail);

    await uploader.send(process.env.DISCORD_BOT_TOKEN!);

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
