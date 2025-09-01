import { Client } from "discord.js"
import { schedule } from "node-cron"
import getAndSendChannels from "./getAndSendChannels.js"
import getMessages from "./getMessages.js"
import sendMessages from "./sendMessages.js"
import updateApi from "./updateApi.js"

export default async function queenbeeMonitor(client: Client) {
    schedule('* * * * *', async() => {
        getAndSendChannels(client)
        const messages = await getMessages()
        const result = await sendMessages(client, messages)
        await updateApi(result)
    })
}
