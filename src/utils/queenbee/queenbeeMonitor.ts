import { Client } from "discord.js"
import { schedule } from "node-cron"
import getAndSendChannels from "./getAndSendChannels.ts"
import getMessages from "./getMessages.ts"
import sendMessages from "./sendMessages.ts"
import updateApi from "./updateApi.ts"
import getAndSendRoles from "./getAndSendRoles.ts"

export default async function queenbeeMonitor(client: Client) {
    schedule('* * * * *', async() => {
        getAndSendChannels(client)
        getAndSendRoles(client)
        const messages = await getMessages()
        const result = await sendMessages(client, messages)
        await updateApi(result)
    })
}
