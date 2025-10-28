import { AutocompleteInteraction } from 'discord.js'
import handleDeployAndReleaseAutoComplete from './handleDeployAutoComplete.ts'
import handleReopenAutoComplete from './handleReopenAutoComplete.ts'
import handleGithubAutoComplete from '#utils/autocomplete/handleGithubAutoComplete.ts'

export default async function Autocomplete(interaction: AutocompleteInteraction<'cached'>) {
    switch (interaction.commandName) {
        case 'reopen_temp': handleReopenAutoComplete(interaction); break
        case 'issue': handleGithubAutoComplete(interaction); break
        case 'deploy':
        case 'release': handleDeployAndReleaseAutoComplete(interaction); break
    }
}
