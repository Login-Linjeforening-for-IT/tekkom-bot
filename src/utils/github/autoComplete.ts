import getRepositories from "#utils/github/getRepositories.ts"
import { AutocompleteInteraction } from "discord.js"
import sanitize from "#utils/sanitize.ts"

const REPOSITORY = "repository"
const ISSUE = "issue"

export default async function GitHubAutocomplete(interaction: AutocompleteInteraction<"cached">) {
    const focusedName = interaction.options.getFocused(true).name
    const query = sanitize(interaction.options.getFocused(true).value).toLowerCase()
    let relevant = new Set<GithubRepoSearchResultItem>()
    const isIssue = interaction.commandName === ISSUE
    const repositories = await getRepositories(25, query)
    const fallbackResult = `No repositories ${query.length > 0 ? `matching '${query}'` : ''} found on GitHub.`

    // Autocompletes repositories
    if (focusedName === REPOSITORY) {
        if (query.length) {
            for (const repo of repositories) {
                const name = repo.name.toLowerCase()
                if (name.includes(query)) {
                    relevant.add(repo)
                }
            }
        } else {
            relevant = new Set(repositories)
        }
    }

    if (!relevant.size) {
        return await interaction.respond([{name: fallbackResult, value: fallbackResult}])
    }

    const seen: string[] = []
    const uniqueResponse: {name: string, value: string}[] = []
    Array.from(relevant).slice(0, 25).map((item: GithubRepoSearchResultItem) => {
        const name = item.name
        if (!seen.includes(name)) {
            seen.push(name)
            uniqueResponse.push({
                name: name, 
                value: name
            })
        }
    })

    await interaction
        .respond(uniqueResponse)
        .catch(console.log)
}
