import Autocomplete from '#utils/gitlab/autoComplete.ts'
import GitHubAutocomplete from '#utils/github/autoComplete.ts'
import validCommands, { exceptions } from '#utils/valid.ts'
import handleComponents from '#utils/handleComponents.ts'
import getID from '#utils/tickets/getID.ts'
import { DiscordClient } from '#interfaces'
import type {
    AutocompleteInteraction,
    CacheType,
    ChatInputCommandInteraction,
    Interaction,
} from 'discord.js'
import { InteractionType } from "discord.js"

type HandleInteractionProps = {
    interaction: Interaction<CacheType>
    client: DiscordClient
}

export default async function handleInteraction({ interaction, client }: HandleInteractionProps) {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        const autocompleteInteraction = interaction as AutocompleteInteraction<"cached">
        
        // Use GitHub autocomplete for issue command, GitLab for others
        if (autocompleteInteraction.commandName === 'issue') {
            GitHubAutocomplete(autocompleteInteraction)
        } else {
            Autocomplete(autocompleteInteraction)
        }
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

    if (
        validCommands.includes(chatInteraction.commandName)
        || ('customId' in interaction && validCommands.includes(interaction.customId as string))
    ) {
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
}
