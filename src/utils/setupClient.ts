import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} from 'discord.js'
import { DiscordClient } from '../interfaces.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function setupClient() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildPresences,
        ],
        partials: [
            Partials.Message,
            Partials.Channel,
            Partials.Reaction,
            Partials.User,
        ],
    }) as DiscordClient
    
    client.commands = new Collection()
    const foldersPath = join(__dirname, '..', 'commands')
    const commandFolders = readdirSync(foldersPath)
    
    for (const folder of commandFolders) {
        const commandsPath = join(foldersPath, folder)
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'))
        for (const file of commandFiles) {
            const filePath = join(commandsPath, file)
            const command = await import(filePath)
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command)
            } else {
                console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
            }
        }
    }

    return client
}
