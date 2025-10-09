import config from "./config.ts"

// Fetches all articles (messages) for a specific Zammad ticket
export default async function fetchTicket(id: number, recipient: boolean = false): Promise<ErrorClosed | ReducedMessage[] | string | Error> {
    try {
        const response = await fetch(`${config.api}/ticket/${id}/${recipient}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data)
        }

        if (recipient) {
            const data = await response.text()
            return data
        }

        const data = await response.json()
        return data
    } catch (error) {
        return error as Error
    }
}

export async function closeTicket(id: number, author: string) {
    const recipient = await fetchTicket(id, true)

    if (recipient) {
        try {
            const response = await fetch(`${config.api}/ticket/${id}/${author}/${recipient}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data)
            }

            const data = await response.json()
            return data
        } catch (error) {
            return error
        }
    }
}
