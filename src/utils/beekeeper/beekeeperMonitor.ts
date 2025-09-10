import { Client, EmbedBuilder, Message, TextChannel } from "discord.js"
import { schedule } from "node-cron"
import getNamespaces from "./getNamespaces.js"
import config from "../config.js"

const STATUS_TITLE = "Beekeeper Monitor"
const ONE_DAY_MS = 24 * 60 * 60 * 1000

export default async function beekeeperMonitor(client: Client) {
    const channelID: string = config.beekeeper_monitoring
    const beekeeper: string = config.beekeeper_role
    const channel = await client.channels.fetch(channelID) as TextChannel

    if (!channel) {
        throw new Error(`Channel with ID ${channelID} not found.`)
    }

    // Only schedules if running in Kubernetes to prevent false positives if
    // testing locally without a vpn.
    if (config.kubernetesServicePort) {
        schedule('* * * * *', async() => {
            const namespaces = await getNamespaces()
            const up = !!namespaces.length
            const embed = new EmbedBuilder()
                .setTitle("Beekeeper Monitor")
                .setDescription(
                    up
                        ? "🐝 Beekeeper is **UP** and running smoothly."
                        : "⚠️ Beekeeper is **DOWN**. No namespaces found."
                )
                .setColor("#dec083")
    
            // find the latest status message from the past 24h posted by this bot
            const since = Date.now() - ONE_DAY_MS
            const recent = await fetchRecentMessages(channel, since)
            const lastStatus = recent.find((m) =>
                m.author.id === client.user?.id &&
                m.embeds?.[0]?.title === STATUS_TITLE
            )
            const lastWasDown = !!lastStatus?.embeds?.[0]?.description?.toLowerCase().includes("down")
            if (!up && (!lastStatus || !lastWasDown)) {
                // DOWN
                await channel.send({
                    content: `<@&${beekeeper}>`,
                    embeds: [embed],
                    allowedMentions: { roles: [beekeeper] }
                })
            }
    
            if (up && lastStatus && lastWasDown) {
                // UP
                await lastStatus.edit({
                    content: "",
                    embeds: [embed],
                    allowedMentions: { parse: [] },
                })
            }
        })
    }
}

/** Fetch channel messages until older than `sinceMs` (or no more). */
async function fetchRecentMessages(channel: TextChannel, sinceMs: number): Promise<Message[]> {
    const all: Message[] = []
    let before: string | undefined = undefined

    while (true) {
        const batch: any = await channel.messages.fetch({ limit: 100, before })
        if (batch.size === 0) break

        const withinWindow: Message[] = []
        for (const m of batch.values()) {
            if (m.createdTimestamp >= sinceMs) {
                withinWindow.push(m)
            }
        }

        all.push(...withinWindow)

        // stop if the oldest in this batch is older than the window
        const oldest = [...batch.values()].at(-1)
        if (!oldest || oldest.createdTimestamp < sinceMs) {
            break
        }

        before = oldest.id
    }
    // newest first
    all.sort((a, b) => b.createdTimestamp - a.createdTimestamp)
    return all
}
