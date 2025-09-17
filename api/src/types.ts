declare global {
    type Channel = { 
        guildId: string
        guildName: string
        channelId: string
        channelName: string
    }

    type Role = { 
        name: string
        id: string
        color: string
    }

    type Announcement = {
        id: string
        title: string
        description: string
        channel: string
        roles: string[]
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
        roles: string[]
        embed?: boolean
        color?: string
        interval: string
        time?: string
        last_sent: string
    }

    type Btg = {
        name: string
        service: string
        author: string
    }

    type SQLParamType = (string | number | null | boolean | string[] | Date)[]
}
