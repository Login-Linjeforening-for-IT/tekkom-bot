import { ChannelType, Client, PermissionsBitField } from "discord.js"
import type { NonThreadGuildBasedChannel } from 'discord.js'
import config from "#config"

const tekkomBotApiUrl = config.tekkomBotApiUrl
const tekkomBotApiToken = config.tekkomBotApiToken
const LOGIN_GUILD = "284789429539700736"

/**
 * Fetches all channels the bot can write to in the 'Login - Linjeforeningen for IT' server
 * @param client Discord client
 * @returns void
 */
export default async function getAndSendTextChannels(client: Client): Promise<void> {
    const GUILD_ID = LOGIN_GUILD
    const data: any[] = []

    try {
        const guild = client.guilds.cache.get(GUILD_ID)
        if (!guild) {
            console.warn(`Bot is not in guild with ID ${GUILD_ID}`)
            return
        }

        const channels = await guild.channels.fetch()
        channels.forEach((channel: NonThreadGuildBasedChannel | null) => {
            if (!channel || !channelFilter(channel)) return
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
                    id: channel.id,
                    name: channel.name,
                    category: channel.parent?.name,
                })
            }
        })

        const response = await fetch(`${tekkomBotApiUrl}/channels`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tekkomBotApiToken}`,
                'btg': 'tekkom-bot',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const result = await response.json() as { message: string }
        console.log(result.message)
    } catch (error) {
        console.log(error)
    }
}

function channelFilter(channel: NonThreadGuildBasedChannel | null): boolean {
    if (!channel) {
        return false
    }

    const parent = channel.parent?.name.toLocaleLowerCase() || ''
    if (parent.includes('archive')) {
        return false
    }

    if (parent === '―for alle―') {
        return false
    }

    if (parent === '―regler og roller―') {
        return false
    }

    return true
}
