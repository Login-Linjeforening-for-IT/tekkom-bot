import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import config from './utils/config.js'
import roles from './managed/roles.js'
import { 
    ChatInputCommandInteraction, 
    Client, 
    Collection, 
    Events, 
    GatewayIntentBits, 
    Interaction, 
    InteractionType, 
    Message, 
    Partials, 
    Reaction, 
    ThreadChannel, 
    User 
} from 'discord.js'
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
}) as any

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

client.once(Events.ClientReady, async () => {
    for (const role of roles) {
        try {
            const { message, channelID } = role

            // Fetch channel and message
            const channel = await client.channels.fetch(channelID)
            if (!channel) {
                return console.error(`Channel with ID ${channelID} not found.`)
            }

            const roleMessage = await (channel as any).messages.fetch(message)
            if (!roleMessage) {
                return console.error(`Message with ID ${message} not found.`)
            }

            // Fetches missing partial data for the message
            if (roleMessage.partial) {
                try {
                    await roleMessage.fetch()
                } catch (error) {
                    console.error(`Something went wrong when fetching role message partial: ${error}`)
                    return
                }
            }

            // Extract guild, roles, and icons
            const guild = client.guilds.cache.get(roleMessage.guildId)
            const content = roleMessage.embeds[0].data.fields[0].value
            if (!guild) {
                return console.error(`Guild ${roleMessage.guildId} does not exist.`)
            }

            const roleRegex = /<@&(\d+)>/g
            const messageRoles = content.match(roleRegex) || []
            const roleIds = messageRoles.map((match: string) => match.slice(3, -1))

            const icons = content.split('\n').map((icon: string) =>
                icon[1] === ':' ? icon.split(':')[1] : icon.substring(0, 2)
            )

            // Create a reaction collector
            const roleCollector = roleMessage.createReactionCollector({
                filter: (reaction: Reaction, user: User) => !user.bot,
                dispose: true,
            })

            addRole({ collector: roleCollector, guild, roles: roleIds, icons})
        } catch (error: any) {
            console.error("Error processing roles:", error)
        }
    }

    // Creates TekKom meeting agendas
    autoCreateTekKomMeetings(client)

    // Creates Styret meeting agendas
    autoCreateStyretMeetings(client)

    // Automatically syncronizes messages from Zammad to Discord
    autoSyncZammad(client)

    console.log("Ready!")
})

client.on(Events.InteractionCreate, async (interaction: Interaction<"cached">) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        Autocomplete(interaction)
        return
    }

    const chatInteraction = interaction as ChatInputCommandInteraction

	if (!interaction.isChatInputCommand() && !('customId' in interaction)) {
        console.error('Input is not a command nor interaction.')
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
            console.error(`${interaction.commandName || interaction.customId} is not a valid command in app.ts`)
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
			console.error('Something went wrong when fetching the message:', error)
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


client.login(token)

process.on("unhandledRejection", async (err) => {
    if ((err as {message: string}).message === "Interaction has already been acknowledged.") {
        return console.error("Interaction has already been acknowledged.")
    }

    console.error("Unhandled Promise Rejection:\n", err)
})

process.on("uncaughtException", async (err) => {
    console.error("Uncaught Promise Exception:\n", err)
})

process.on("uncaughtExceptionMonitor", async (err) => {
    console.error("Uncaught Promise Exception (Monitor):\n", err)
})


export default client
