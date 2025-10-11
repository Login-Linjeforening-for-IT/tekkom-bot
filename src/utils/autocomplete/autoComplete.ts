import { AutocompleteInteraction } from 'discord.js'
import handleDeployAndReleaseAutoComplete from './handleDeployAutocomplete.ts'
import handleReopenAutoComplete from './handleReopenAutoComplete.ts'

export default async function Autocomplete(interaction: AutocompleteInteraction<"cached">) {
    switch (interaction.commandName) {
        case 'reopen_temp': handleReopenAutoComplete(interaction); break;
        case 'deploy': 
        case 'release': handleDeployAndReleaseAutoComplete(interaction); break
    }
}
