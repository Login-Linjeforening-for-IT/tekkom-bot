import { ChannelType, Client, NonThreadGuildBasedChannel, PermissionsBitField } from "discord.js"
import config from "../config.js"

const tekkomBotApiUrl = config.tekkomBotApiUrl

/**
 * Fetches all channels the bot can write to in the 'Login - Linjeforeningen for IT' server
 * @param client Discord client
 * @returns void
 */
export default async function getAndSendTextChannels(client: Client): Promise<void> {
    const GUILD_ID = "284789429539700736"
    const data: any[] = []

    try {
        const guild = client.guilds.cache.get(GUILD_ID)
        if (!guild) {
            console.warn(`Bot is not in guild with ID ${GUILD_ID}`)
            return
        }

        const channels = await guild.channels.fetch()
        channels.forEach((channel: NonThreadGuildBasedChannel | null) => {
            if (!channel) return
            if (
                channel.type === ChannelType.GuildText &&
                channel.permissionsFor(guild.members.me!)?.has([
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages
                ])
            ) {
                data.push({
                    guildId: guild.id,
                    guildName: guild.name,
                    channelId: channel.id,
                    channelName: channel.name,
                })
            }
        })

        const response = await fetch(`${tekkomBotApiUrl}/channels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const result = await response.json() as object
        console.log(result)
    } catch (error) {
        console.error(error)
    }
}
