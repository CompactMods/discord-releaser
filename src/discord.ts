import {
    Client, EmbedBuilder, Events, GatewayIntentBits,
    Channel, BaseGuildTextChannel,
    bold, inlineCode
} from "discord.js";

export class ModFileMetadata {
    public modName = "Test Mod";
    public modVersion = "1.0.0";
    public fileSize = "1.0 MB";

    public mcVersion?: string;
    public forgeVersion?: string;
}

export class DiscordModFileUploader {

    public modMetadata?: ModFileMetadata;
    public modThumbnail?: string;

    private client: Client;
    private targetChannelId?: string;
    private targetChannel?: Channel;

    private constructor(private readonly filename: string) {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds]
        });
    }

    private async onConnected() {
        // Get Target Channel
        if (!this.targetChannelId)
            throw new Error("No target channel specified; refusing to continue.");

        if (!this.modMetadata)
            throw new Error("No mod metadata defined.");

        this.targetChannel = this.client.channels.cache.get(this.targetChannelId);
        if (!(this.targetChannel instanceof BaseGuildTextChannel))
            return;

        try {
            const target = this.targetChannel as BaseGuildTextChannel;

            // Emoji
            let embedMeta: string[] = [];
            if (this.modMetadata.mcVersion) {
                let grass = this.client.emojis.cache.get("1063420847085322252");
                embedMeta.push(`${grass} - ${this.modMetadata.mcVersion}`);
            }

            if (this.modMetadata.forgeVersion) {
                let forge = this.client.emojis.cache.get("1041688944586268683");
                embedMeta.push(`${forge} - ${this.modMetadata.forgeVersion}`);
            }

            // Build embed
            let payload = new EmbedBuilder()
                .setTitle("Mod File Information")
                .setDescription(`Filename: ${inlineCode(this.filename)}\nFilesize: ${bold(this.modMetadata.fileSize)}`)
                .setTimestamp();

            if(embedMeta.length > 0)
                payload = payload.addFields({ name: '\u200b', value: embedMeta.join("\n") });

            if (this.modThumbnail)
                payload = payload.setThumbnail(this.modThumbnail)

            // Yeet
            await target.send({
                content: bold(`New Version Available: ${this.modMetadata.modName} v${this.modMetadata.modVersion}`),
                embeds: [payload],
                files: [this.filename]
            });

        }

        catch (err) {
            console.error(err);
        }

        this.client.destroy();
    }

    static forFile(filename: string): DiscordModFileUploader {
        return new DiscordModFileUploader(filename);
    }

    public channel(chan: string): DiscordModFileUploader {
        this.targetChannelId = chan;
        return this;
    }

    public metadata(meta: ModFileMetadata): DiscordModFileUploader {
        this.modMetadata = meta;
        return this;
    }

    public thumbnail(thumbnail: string): DiscordModFileUploader {
        this.modThumbnail = thumbnail;
        return this;
    }

    async send(token: string) {
        this.client.once(Events.ClientReady, this.onConnected.bind(this));
        await this.client.login(token);
    }
}
