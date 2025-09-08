import { Client } from "discord.js"
import { schedule } from "node-cron"
import getAndSendChannels from "./getAndSendChannels.js"
import getMessages from "./getMessages.js"
import sendMessages from "./sendMessages.js"
import updateApi from "./updateApi.js"
import getAndSendRoles from "./getAndSendRoles.js"

export default async function queenbeeMonitor(client: Client) {
    schedule('* * * * *', async() => {
        getAndSendChannels(client)
        getAndSendRoles(client)
        const messages = await getMessages()
        const result = await sendMessages(client, messages)
        await updateApi(result)
    })
}
