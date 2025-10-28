import sanitize from '#utils/sanitize.ts'
import { getArchivedTickets } from '#utils/tickets/ticket.ts'
import { AutocompleteInteraction } from 'discord.js'

export default async function handleReopenAutoComplete(interaction: AutocompleteInteraction<'cached'>) {
    const query = sanitize(interaction.options.getFocused(true).value).toLowerCase()
    const relevant = new Set<TicketOption>()
    const tickets = await getArchivedTickets(interaction)
    const fallbackResult = `No tickets ${query.length > 0 ? `matching '${query}'` : ''} exist.`

    // Autocompletes tickets
    if (query.length) {
        for (const ticket of tickets) {
            const name = ticket.label.toLowerCase()
            if (name.includes(query)) {
                relevant.add(ticket)
            }
        }
    }

    if (!relevant.size) {
        return await interaction.respond([{name: fallbackResult, value: fallbackResult}])
    }

    const seen: string[] = []
    const uniqueResponse: {name: string, value: string}[] = []
    // eslint-disable-next-line array-callback-return
    Array.from(relevant).slice(0, 25).map((item: TicketOption) => {
        const name = item.label
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
