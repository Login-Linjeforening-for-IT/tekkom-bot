declare global {
    type Channel = { 
        guildId: string
        guildName: string
        channelId: string
        channelName: string
    }

    type Announcement = {
        id: string
        title: string
        description: string
        channel: string
        embed?: boolean
        color?: string
        interval?: string
        time?: string
    }

    type RecurringAnnouncement = {
        id: string
        title: string
        description: string
        channel: string
        embed?: boolean
        color?: string
        interval: string
        time?: string
        last_sent: string
    }
}
