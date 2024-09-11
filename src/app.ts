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
    Partials, 
    Reaction, 
    User 
} from 'discord.js'
import addRole, { removeRole } from './utils/roles.js'
import autoCreateMeetings from './utils/autoCreateMeetings.js'
import handleComponents from './utils/handleComponents.js'
import getID from './utils/tickets/getID.js'

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
    ],
    partials: [
        Partials.Message, 
        Partials.Channel, 
        Partials.Reaction, 
        Partials.User
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
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
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
                    console.error(`Something went wrong when fetching role message partial: ${error}`)
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
                filter: (reaction: Reaction, user: User) => !user.bot,
                dispose: true,
            })

            addRole({ collector: roleCollector, guild, roles: roleIds, icons})
        } catch (error: any) {
            console.error("Error processing roles:", error)
        }
    }

    autoCreateMeetings(client)

    console.log("Ready!")
})

client.on(Events.InteractionCreate, async (interaction: ChatInputCommandInteraction) => {
	if (!interaction.isChatInputCommand() && !('customId' in interaction)) {
        console.error('NO CHAT LOL')
        return
    }

    const command = client.commands.get(interaction.commandName)
    if (!command && !('customId' in interaction)) {
        console.error('NO COMMAND LOL')
        return
    }

    const components = [
        'add_role_to_ticket',
        'add_user_to_ticket',
        'archive_ticket',
        'close_ticket',
        'add_tag_to_create',
        'add_role_to_create',
        'add_user_to_create',
        'remove_role_from_ticket',
        'remove_user_from_ticket',
        'reopen_channel',
        'add_tag_to_open_ticket',
        'view_ticket_command',
        'add_role_to_view_ticket_command',
        'add_user_to_view_ticket_command',
        'create_ticket',
        'view_ticket',
        'tag_ticket',
        'close_ticket',
        'reopen_ticket',
        'create',
        'ticket',
        'close',
        'reopen',
        'tagticket',
        'add',
        'remove',
        'get',
        'view',
        'close_ticket_selected',
        'addviewer',
        'add_role_viewer_to_ticket',
        'add_user_viewer_to_ticket',
    ]

    if (components.includes(interaction.commandName) || ('customId' in interaction && components.includes(interaction.customId as string))) {
        return handleComponents(interaction, getID(interaction.commandName))
    } else {
        // @ts-expect-error
        if (interaction.customId === 'ticket_modal') {
            // Handled in tickets/create.ts
            return
        }

        // @ts-expect-error
        console.error(`${interaction.commandName || interaction.customId} is not a valid command in app.ts`)
    }
1

	try {
		await command.execute(interaction)
    // Catched elsewhere
	} catch (_) {}
})

client.on(Events.MessageReactionRemove, async (reaction: any, user: any) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch()
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error)
			return
		}
	}

    removeRole({ reaction, user })
})

client.login(token)

export default client
