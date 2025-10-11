import getRepositories from '#utils/github/getRepositories.ts'
import { AutocompleteInteraction } from 'discord.js'
import sanitize from '#utils/sanitize.ts'

const REPOSITORY = 'repository'

export default async function handleGithubAutoComplete(interaction: AutocompleteInteraction<'cached'>) {
    const focusedName = interaction.options.getFocused(true).name
    const query = sanitize(interaction.options.getFocused(true).value).toLowerCase()
    let relevant = new Set<GithubRepoSearchResultItem>()
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

    // Custom display names for specific repositories
    const customNames: Record<string, string> = {
        'nucleus': 'App',
        'studentbee': 'Exam',
        'beehive': 'Hoved nettside | Main website',
    }

    Array.from(relevant).slice(0, 25).map((item: GithubRepoSearchResultItem) => {
        const repoName = item.name
        const displayName = customNames[repoName] || repoName
        if (!seen.includes(repoName)) {
            seen.push(repoName)
            uniqueResponse.push({
                name: displayName,
                value: repoName
            })
        }
    })

    await interaction
        .respond(uniqueResponse)
        .catch(console.log)
}
