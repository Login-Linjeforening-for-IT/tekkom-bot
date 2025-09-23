import { DiscordClient } from '../../interfaces.js'
import sendActivity from './sendActivity.js'

const { DISCORD_GUILD_ID } = process.env

export default async function checkAndHandleRepeats(
    client: DiscordClient,
    lastSpotify: LastSpotify
) {
    const guild = client.guilds.cache.get(DISCORD_GUILD_ID ?? '')
    for (const userId of lastSpotify.keys()) {
        const member = guild?.members.cache.get(userId)
        if (!member) {
            // User left or not cached
            lastSpotify.delete(userId)
            continue
        }
        
        const presence = member.presence
        if (!presence) {
            // User is no longer listening
            lastSpotify.delete(userId)
            continue
        }
        
        // Checks what the user is listening to now
        const spotify = presence.activities.find(a => a.type === 2 && a.name === 'Spotify')
        const last = lastSpotify.get(userId)

        // Still listening to Spotify
        if (spotify && spotify.syncId && spotify.timestamps?.start && spotify.timestamps?.end && last) {
            const start = spotify.timestamps?.start?.toISOString() ?? new Date().toISOString()
            const end = spotify.timestamps?.end?.toISOString() ?? new Date().toISOString()
            const image = spotify.assets?.largeImage?.split(':')[1] ?? 'ab67616d0000b273153d79816d853f2694b2cc70'
            const oldStart = last.start
            const oldEnd = last.end
            const listenedDuration = new Date().getTime() - oldStart
            const totalDuration = last.syncId ? (oldEnd - oldStart) : listenedDuration
            const skipped = listenedDuration < (totalDuration * 2 / 3)
            const activity = {
                user: member.user.tag ?? 'Unknown',
                song: spotify.details ?? 'Unknown',
                artist: spotify.state ?? 'Unknown',
                start,
                end,
                album: spotify.assets?.largeText ?? 'Unknown',
                image,
                source: spotify.name,
                userId: member.user.id,
                avatar: member.user.avatar,
                skipped,
                syncId: spotify.syncId
            }
            const startTime = spotify.timestamps.start.getTime()
            const endTime = spotify.timestamps.end.getTime()

            // Repeated song (new startTime)
            if (spotify.syncId === last.syncId && startTime > last.start) {
                const response = await sendActivity(activity)
                const isError = 'error' in response
                if (isError) {
                    console.log(response.message, response.error)
                }
                
                console.log(`${member.user.tag} ${isError ? 'tried to repeat' : 'repeated'} the song: ${spotify.details} by ${spotify.state}, skipped: ${skipped}`)
            } else if (spotify.syncId !== last?.syncId) {
                // New song
                const response = await sendActivity(activity)
                console.log(response.message)    
            }

            // Stores new reference
            lastSpotify.set(userId, { syncId: spotify.syncId, start: startTime, end: endTime })
        }
    }
}
