import { Client, EmbedBuilder, Message, TextChannel } from "discord.js"
import { schedule } from "node-cron"
import config from "../config.js"
export default async function announcementsMonitor(client: Client) {
    const STATUS_TITLE = "Beekeeper Monitor"
    const ONE_DAY_MS = 24 * 60 * 60 * 1000
    const channelID: string = config.beekeeper_monitoring
    const beekeeper: string = config.beekeeper_role
    const channel = await client.channels.fetch(channelID) as TextChannel

    if (!channel) {
        throw new Error(`Channel with ID ${channelID} not found.`)
    }

    schedule('* * * * *', async() => {
        // get announcements

        // any new ones without time should be sent immediately
        // then status should be sent back
    })
}
