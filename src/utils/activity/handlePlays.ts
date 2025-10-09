import { Presence } from 'discord.js'
import sendGame from './sendGame.ts'

type HandlePlayProps = {
    newPresence: Presence
    currentlyPlaying: CurrentlyPlaying
}

export default async function handlePlays({ newPresence }: HandlePlayProps) {
    const playing = newPresence.activities.find(a => a.type === 0) as unknown as Game

    if (playing) {
        const activity = {
            user: newPresence.user?.tag ?? 'Unknown',
            name: playing.name,
            details: playing.details ?? null,
            state: playing.state ?? null,
            application: playing.applicationId,
            start: playing.timestamps?.start?.toISOString() ?? new Date().toISOString(),
            party: JSON.stringify(playing.party),
            image: playing.assets?.smallImage ?? playing.assets?.largeImage ?? null,
            imageText: playing.assets?.smallText ?? playing.assets?.largeText ?? null,
            userId: newPresence.userId,
            avatar: newPresence.user?.avatar,
        }

        const response = await sendGame(activity)
        console.log(response.message)
        return
    }
}
