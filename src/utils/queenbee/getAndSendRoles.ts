import { Client, Role } from "discord.js"
import config from "../config.ts"

const tekkomBotApiUrl = config.tekkomBotApiUrl
const tekkomBotApiToken = config.tekkomBotApiToken
const LOGIN_GUILD = "284789429539700736"

/**
 * Fetches all channels the bot can write to in the 'Login - Linjeforeningen for IT' server
 * @param client Discord client
 * @returns void
 */
export default async function getAndSendRoles(client: Client): Promise<void> {
    const GUILD_ID = LOGIN_GUILD
    const data: { name: string, id: string, color: string }[] = []

    try {
        const guild = client.guilds.cache.get(GUILD_ID)
        if (!guild) {
            console.warn(`Bot is not in guild with ID ${GUILD_ID}`)
            return
        }

        const roles = await guild.roles.fetch()
        roles.forEach((role: Role) => {
            if (role.name === '@everyone' || role.id === '284789429539700736') {
                return
            }

            data.push({
                name: role.name,
                id: role.id,
                color: role.hexColor
            })
        })

        const response = await fetch(`${tekkomBotApiUrl}/roles`, {
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
