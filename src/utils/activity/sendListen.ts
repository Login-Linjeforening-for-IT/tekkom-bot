import config from '../config.ts'

const tekkomBotApiToken = config.tekkomBotApiToken

export default async function sendListen({
    user,
    song,
    artist,
    start,
    end,
    album,
    image,
    source,
    userId,
    avatar,
    skipped,
    syncId
}: SendActivity): Promise<{ message: string } | { error: unknown, message: string }> {
    try {
        const response = await fetch(`${config.tekkomBotApiUrl}/listen`, {
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
                userId,
                avatar,
                skipped,
                syncId
            })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return { error, message: `Failed to add activity ${song} by ${artist} for ${user}.` }
    }
}
