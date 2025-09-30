import { DiscordClient } from '../../interfaces.js'
import sendGameUpdate from './sendGameUpdate.js'

const { DISCORD_GUILD_ID } = process.env

export default async function checkAndHandlePlays(
    client: DiscordClient,
    currentlyPlaying: CurrentlyPlaying
) {
    const guild = client.guilds.cache.get(DISCORD_GUILD_ID ?? '')
    if (!guild) {
        throw new Error('Guild missing in checkAndHandlePlays, check env variables.')
    }

    for (const userId of currentlyPlaying.keys()) {
        const member = guild?.members.cache.get(userId)
        if (!member) {
            // User left or not cached
            currentlyPlaying.delete(userId)
            continue
        }
        
        const user = currentlyPlaying.get(userId)
        const presence = member.presence

        // User is no longer playing
        if (!presence && user){
            const duration = new Date().getTime() - user.start
            const activity = { userId, game: user.game, duration }
            sendGameUpdate(activity)

            currentlyPlaying.delete(userId)
            continue
        }
        
        // Checks what the user is playing to now
        const game = presence!.activities.find(a => a.type === 0) as unknown as Game

        // New game
        if (game && user && game.name !== user.game) {
            const duration = new Date().getTime() - user.start
            const activity = { userId, game, duration }
            sendGameUpdate(activity)

            // Stores new reference
            currentlyPlaying.set(userId, { 
                game: game.name,
                start: game.timestamps?.start?.getTime() ?? new Date().getTime() 
            })
        }
    }
}
