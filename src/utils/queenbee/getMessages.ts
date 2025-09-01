import config from "../config.js"

const tekkomBotApiUrl = config.tekkomBotApiUrl

export default async function getMessages() {
    try {
        const url = new URL(`${tekkomBotApiUrl}/announcements`)
        url.searchParams.set("shouldBeSent", "true")
        url.searchParams.set("active", "true")
        const response = await fetch(url.toString())

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
