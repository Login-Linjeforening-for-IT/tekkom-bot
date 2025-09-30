import config from './utils/config.js'
import { removeRole } from './utils/roles.js'
import autoCreateTekKomMeetings from './utils/meetings/autoCreateTekKomMeetings.js'
import handleTickets from './utils/tickets/handler.js'
import autoSyncZammad from './utils/tickets/autoSyncZammad.js'
import autoCreateStyretMeetings from './utils/meetings/autoCreateStyretMeetings.js'
import channelTemplates from './utils/channelTemplates.js'
import beekeeperMonitor from './utils/beekeeper/beekeeperMonitor.js'
import queenbeeMonitor from './utils/queenbee/queenbeeMonitor.js'
import heartbeat from './utils/heartbeat/heartbeat.js'
import {
    CacheType,
    Events,
    Interaction,
    Message,
    Presence,
    ThreadChannel,
} from 'discord.js'
import handleListens from './utils/activity/handleListens.js'
import handlePlays from './utils/activity/handlePlays.js'
import checkAndHandleListenRepeats from './utils/activity/checkAndHandleListenRepeats.js'
import checkAndHandlePlayRepeats from './utils/activity/checkAndHandlePlays.js'
import handleInteraction from './utils/handleInteraction.js'
import handleRoles from './utils/handleRoles.js'
import setupClient from './utils/setupClient.js'

const token = config.token
const client = await setupClient()
const lastListens: LastListens = new Map()
const currentlyPlaying: CurrentlyPlaying = new Map()

client.once(Events.ClientReady, async () => {
    handleRoles(client)
    autoCreateTekKomMeetings(client)
    autoCreateStyretMeetings(client)
    queenbeeMonitor(client)
    beekeeperMonitor(client)
    autoSyncZammad(client)
    heartbeat()
    console.log("Ready!")
})

client.on<Events.InteractionCreate>(Events.InteractionCreate, async (interaction: Interaction<CacheType>) => {
    await handleInteraction({ interaction, client })
})

client.on(Events.ThreadCreate, async (thread: ThreadChannel) => {
    await channelTemplates(thread)
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
    handleTickets(message)
})

client.on<Events.PresenceUpdate>(Events.PresenceUpdate, async (oldPresence, newPresence: Presence) => {
    handleListens({ oldPresence, newPresence, lastListens })
    handlePlays({ newPresence, currentlyPlaying })
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

setInterval(async () => {
    await checkAndHandleListenRepeats(client, lastListens)
    await checkAndHandlePlayRepeats(client, currentlyPlaying)
}, 5000)

export default client
