import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import config from './utils/config.js'
import roles from './managed/roles.js'
import addRole, { removeRole } from './utils/roles.js'
import autoCreateTekKomMeetings from './utils/meetings/autoCreateTekKomMeetings.js'
import handleComponents from './utils/handleComponents.js'
import getID from './utils/tickets/getID.js'
import validCommands, { exceptions } from './utils/valid.js'
import handleTickets from './utils/tickets/handler.js'
import autoSyncZammad from './utils/tickets/autoSyncZammad.js'
import autoCreateStyretMeetings from './utils/meetings/autoCreateStyretMeetings.js'
import Autocomplete from './utils/gitlab/autoComplete.js'
import templates from './utils/templates.js'
import beekeeperMonitor from './utils/beekeeper/beekeeperMonitor.js'
import queenbeeMonitor from './utils/queenbee/queenbeeMonitor.js'
import heartbeat from './utils/heartbeat/heartbeat.js'
import {
    AutocompleteInteraction,
    CacheType,
    ChatInputCommandInteraction,
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    Interaction,
    InteractionType,
    Message,
    Partials,
    Presence,
    Reaction,
    ThreadChannel,
    User
} from 'discord.js'
import sendActivity from './utils/music/sendActivity.js'
import sendGame from './utils/music/sendGame.js'
import checkAndHandleRepeats from './utils/music/checkAndHandleRepeats.js'
import { DiscordClient } from './interfaces.js'

const token = config.token
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
const foldersPath = join(__dirname, 'commands')
const commandFolders = readdirSync(foldersPath)

for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder)
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'))
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

const lastSpotify: Map<string, { syncId: string, start: number, end: number }> = new Map()

client.once(Events.ClientReady, async () => {
    for (const role of roles) {
        try {
            const { message, channelID } = role

            // Fetch channel and message
            const channel = await client.channels.fetch(channelID)
            if (!channel) {
                return console.log(`Channel with ID ${channelID} not found.`)
            }

            const roleMessage = await (channel as any).messages.fetch(message)
            if (!roleMessage) {
                return console.log(`Message with ID ${message} not found.`)
            }

            // Fetches missing partial data for the message
            if (roleMessage.partial) {
                try {
                    await roleMessage.fetch()
                } catch (error) {
                    console.log(`Something went wrong when fetching role message partial: ${error}`)
                    return
                }
            }

            // Extract guild, roles, and icons
            const guild = client.guilds.cache.get(roleMessage.guildId)
            const content = roleMessage.embeds[0].data.fields[0].value
            if (!guild) {
                return console.log(`Guild ${roleMessage.guildId} does not exist.`)
            }

            const roleRegex = /<@&(\d+)>/g
            const messageRoles = content.match(roleRegex) || []
            const roleIds = messageRoles.map((match: string) => match.slice(3, -1))

            const icons = content.split('\n').map((icon: string) =>
                icon[1] === ':' ? icon.split(':')[1] : icon.substring(0, 2)
            )

            // Create a reaction collector
            const roleCollector = roleMessage.createReactionCollector({
                filter: (_: Reaction, user: User) => !user.bot,
                dispose: true,
            })

            addRole({ collector: roleCollector, guild, roles: roleIds, icons })
        } catch (error: any) {
            console.log(`Error processing roles: ${error}`)
        }
    }

    // Creates TekKom meeting agendas
    autoCreateTekKomMeetings(client)

    // Creates Styret meeting agendas
    autoCreateStyretMeetings(client)

    // Queenbee Monitor
    queenbeeMonitor(client)

    // BeeKeeper Monitor
    beekeeperMonitor(client)

    // Automatically syncronizes messages from Zammad to Discord
    autoSyncZammad(client)

    // Heartbeat
    heartbeat()

    console.log("Ready!")
})

client.on<Events.InteractionCreate>(Events.InteractionCreate, async (interaction: Interaction<CacheType>) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        Autocomplete(interaction as AutocompleteInteraction<"cached">)
        return
    }

    const chatInteraction = interaction as ChatInputCommandInteraction

    if (!interaction.isChatInputCommand() && !('customId' in interaction)) {
        console.log('Input is not a command nor interaction.')
        return
    }

    const command = client.commands.get(chatInteraction.commandName)
    if (!command && !('customId' in chatInteraction)) {
        return
    }

    if (validCommands.includes(chatInteraction.commandName) || ('customId' in interaction && validCommands.includes(interaction.customId as string))) {
        return handleComponents(chatInteraction, getID(chatInteraction.commandName))
    } else {
        // @ts-expect-error
        const customId = interaction.customId
        if (customId && !exceptions.includes(customId)) {
            // @ts-expect-error
            console.log(`${interaction.commandName || interaction.customId} is not a valid command in app.ts`)
        }

    }

    if (!command) {
        return
    }

    await command.execute(interaction)
})

client.on(Events.ThreadCreate, async (thread: ThreadChannel) => {
    // Channel templates
    await templates(thread)
})

client.on(Events.MessageReactionRemove, async (reaction: any, user: any) => {
    // Checks if a reaction is partial, and if so fetches the entire structure
    if (reaction.partial) {
        try {
            await reaction.fetch()
        } catch (error) {
            console.log('Something went wrong when fetching the message:', error)
            return
        }
    }

    removeRole({ reaction, user })
})

client.on(Events.MessageCreate, async (message: Message) => {
    const regex = /#\d{1,7}\b/g
    const matches = message.content.match(regex)

    // Ticket handling
    handleTickets({ matches, message })
})

client.on<Events.PresenceUpdate>(Events.PresenceUpdate, async (oldPresence, newPresence: Presence) => {
    const oldData = oldPresence?.activities.find(a => a.type === 2 && a.name === 'Spotify')
    const listening = newPresence.activities.find(a => a.type === 2 && a.name === 'Spotify')
    const playing = newPresence.activities.find(a => a.type === 0) as unknown as Game
    const user = newPresence.user?.tag ?? 'Unknown'
    const userId = newPresence.userId

    if (listening) {
        const oldStart = oldData?.timestamps?.start ?? null
        const oldEnd = oldData?.timestamps?.end ?? null
        const start = listening.timestamps?.start?.toISOString() ?? new Date().toISOString()
        const end = listening.timestamps?.end?.toISOString() ?? new Date().toISOString()
        const image = listening.assets?.largeImage?.split(':')[1] ?? 'ab67616d0000b273153d79816d853f2694b2cc70'
        let skipped = false

        if (oldStart && oldEnd) {
            const listenedDuration = new Date().getTime() - oldStart.getTime()
            const totalDuration = oldData?.syncId ? (oldEnd.getTime() - oldStart.getTime()) : listenedDuration
            skipped = listenedDuration < (totalDuration * 2 / 3)
        }

        const activity = {
            user,
            song: listening.details ?? 'Unknown',
            artist: listening.state ?? 'Unknown',
            start,
            end,
            album: listening.assets?.largeText ?? 'Unknown',
            image,
            source: listening.name,
            userId,
            avatar: newPresence.user?.avatar,
            skipped,
            syncId: listening.syncId ?? 'Unknown'
        }

        const last = lastSpotify.get(userId)
        if (!last) {
            const response = await sendActivity(activity)
            console.log(response.message)
            lastSpotify.set(userId, { 
                syncId: listening.syncId!, 
                start: new Date(start).getTime(), 
                end: new Date(end).getTime()
            })
        }

        return
    }

    if (playing) {
        const activity = {
            user: newPresence.user?.tag ?? 'Unknown',
            name: playing.name,
            details: playing.details ?? null,
            state: playing.state ?? null,
            application: playing.applicationId,
            start: playing.timestamps?.start?.toISOString() ?? new Date().toISOString(),
            party: JSON.stringify(playing.party),
            image: playing.assets?.smallImage ?? playing.assets?.largeImage ?? null,
            imageText: playing.assets?.smallText ?? playing.assets?.largeText ?? null,
            userId: newPresence.userId,
            avatar: newPresence.user?.avatar,
        }

        const response = await sendGame(activity)
        console.log(response.message)
        return
    }
})

client.login(token)

process.on("unhandledRejection", async (error) => {
    if ((error as { message: string }).message === "Interaction has already been acknowledged.") {
        return console.log("Interaction has already been acknowledged.")
    }

    console.log(`Unhandled Promise Rejection:\n${error}`)
})

process.on("uncaughtException", async (error) => {
    console.log(`Uncaught Promise Exception:\n${error}`)
})

process.on("uncaughtExceptionMonitor", async (error) => {
    console.log(`Uncaught Promise Exception (Monitor):\n${error}`)
})

setInterval(async() => {
    await checkAndHandleRepeats(client, lastSpotify)
}, 5000)

export default client
