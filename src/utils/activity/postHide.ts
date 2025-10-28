import config from '#config'

const tekkomBotApiToken = config.tekkomBotApiToken

export default async function postHide(user: string) {
    try {
        const response = await fetch(`${config.tekkomBotApiUrl}/activity/hide`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tekkomBotApiToken}`,
                'btg': 'tekkom-bot',
            },
            body: JSON.stringify({ user })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return `Failed to update user ${user}`
    }
}
