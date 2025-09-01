import config from "../config.js"

const tekkomBotApiUrl = config.tekkomBotApiUrl

export default async function updateApi(messages: Announcement[]) {
    try {
        const ids = messages.map((message) => message.id)
        const response = await fetch(`${tekkomBotApiUrl}/sent`, {
            method: 'POST',
            body: JSON.stringify(ids)
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}
