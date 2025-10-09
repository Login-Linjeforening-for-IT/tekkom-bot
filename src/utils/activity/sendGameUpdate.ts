import config from '../config.ts'

const tekkomBotApiToken = config.tekkomBotApiToken

export default async function sendGameUpdate({ userId, game, duration }: SendGameUpdate) {
    try {
        const response = await fetch(`${config.tekkomBotApiUrl}/playing`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tekkomBotApiToken}`,
                'btg': 'tekkom-bot',
            },
            body: JSON.stringify({ userId, game, duration })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return { error, humanReadable: `Failed to update game ${game} for ${userId}.` }
    }
}
