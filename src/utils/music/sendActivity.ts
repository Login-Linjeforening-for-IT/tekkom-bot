import config from '../config.js'

const tekkomBotApiToken = config.tekkomBotApiToken

export default async function sendActivity({
    user,
    song,
    artist,
    start,
    end,
    album,
    image,
    source,
    user_id,
    avatar,
    skipped
}: SendActivity) {
    try {
        const response = await fetch(`${config.tekkomBotApiUrl}/activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tekkomBotApiToken}`,
                'btg': 'tekkom-bot',
            },
            body: JSON.stringify({ 
                user,
                song,
                artist,
                start,
                end,
                album,
                image,
                source,
                user_id,
                avatar,
                skipped
            })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return { error, humanReadable: `Failed to add activity ${song} by ${artist} for ${user}.` }
    }
}
