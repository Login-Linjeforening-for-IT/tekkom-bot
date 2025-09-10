import config from "../config.js"

const tekkomBotApiUrl = config.tekkomBotApiUrl
const tekkomBotBtgToken = config.tekkomBotBtgToken

export default async function getBtg(): Promise<Btg[]> {
    try {
        const response = await fetch(`${tekkomBotApiUrl}/btg`, {
            headers: {
                'Content-Type': 'application/json',
                'btg': 'tekkom-bot-btg',
                'Authorization': `Bearer ${tekkomBotBtgToken}`
            }
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}
