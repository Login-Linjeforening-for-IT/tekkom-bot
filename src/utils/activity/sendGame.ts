import config from '#config'

const tekkomBotApiToken = config.tekkomBotApiToken

export default async function sendGame({
    name,
    user,
    userId,
    avatar,
    details,
    state,
    application,
    start,
    party,
    image,
    imageText
}: SendGame) {
    try {
        const response = await fetch(`${config.tekkomBotApiUrl}/playing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tekkomBotApiToken}`,
                'btg': 'tekkom-bot',
            },
            body: JSON.stringify({ 
                name,
                user,
                userId,
                avatar,
                details,
                state,
                application,
                start,
                party,
                image,
                imageText
            })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return { error, humanReadable: `Failed to add game ${name} for ${user}.` }
    }
}
