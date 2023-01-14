// import { DiscordModFileUploader, ModFileMetadata } from '../src/discord'
// import { stat } from "fs/promises";
// import { Stats } from 'fs';
// import { config as loadEnv } from "dotenv";

// loadEnv();

// const filename = process.env.DISCORD_UPLOAD_filename || "";

// async function test() {
//     let fileStats: Stats;
//     try { fileStats = await stat(filename); }
//     catch {
//         console.error("File not found; cannot continue.");
//         return;
//     }

//     const meta: ModFileMetadata = {
//         modName: process.env.DISCORD_UPLOAD_modName!,
//         modVersion: process.env.DISCORD_UPLOAD_modVersion!,
//         fileSize: `${fileStats.size / (1024 * 1000)} MB`,

//         mcVersion: process.env.DISCORD_UPLOAD_mcVersion,
//         forgeVersion: process.env.DISCORD_UPLOAD_forgeVersion
//     };

//     try {
//         console.debug(`Sending information about file ${filename} ...`);

//         await DiscordModFileUploader.forFile(filename)
//             .channel(process.env.DISCORD_UPLOAD_channelId!)
//             .metadata(meta)
//             .thumbnail(process.env.DISCORD_UPLOAD_modThumbnail!)
//             .send(process.env.DISCORD_BOT_TOKEN!);

//     } catch (error) {
//         console.error(error)
//     }
// }

// if(process.env.DISCORD_UPLOAD_filename)
//     test();