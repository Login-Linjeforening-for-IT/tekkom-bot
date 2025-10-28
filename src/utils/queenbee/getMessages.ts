import config from '#config'

const tekkomBotApiUrl = config.tekkomBotApiUrl
const tekkomBotApiToken = config.tekkomBotApiToken

export default async function getMessages() {
    try {
        const url = new URL(`${tekkomBotApiUrl}/announcements`)
        url.searchParams.set('shouldBeSent', 'true')
        url.searchParams.set('active', 'true')
        const response = await fetch(url.toString(), {
            headers: {
                'Content-Type': 'application/json',
                'btg': 'tekkom-bot',
                'Authorization': `Bearer ${tekkomBotApiToken}`
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
