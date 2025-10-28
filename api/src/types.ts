export {}
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

    type Activity = {
        id: string
        user: string
        name: string
        artist: string
        start: string
        end: string
        album: string
        image: string
        source: string
        avatar: string
        userId: string
        skipped: boolean
    }

    type Music = {
        stats: MusicStats
        currentlyListening: CurrentlyListening[]
        mostPlayedAlbums: Album[]
        mostPlayedArtists: ArtistPlayed[]
        mostPlayedSongs: CountedSong[]
        mostPlayedSongsPerDay: SongDay[]
        topFiveToday: TopXSong[]
        topFiveYesterday: TopXSong[]
        topFiveThisWeek: TopXSong[]
        topFiveLastWeek: TopXSong[]
        topFiveThisMonth: TopXSong[]
        topFiveLastMonth: TopXSong[]
        topFiveThisYear: TopXSong[]
        topFiveLastYear: TopXSong[]
        mostActiveUsers: MusicUser[]
        mostLikedAlbums: LikedAlbum[]
        mostLikedArtists: LikedArtist[]
        mostLikedSongs: LikedSong[]
        mostSkippedAlbums: SkippedAlbum[]
        mostSkippedArtists: SkippedArtist[]
        mostSkippedSongs: SkippedSong[]
        mostSkippingUsers: MusicSkipUser[]
    }

    type MusicStats = {
        avg_seconds: number
        total_minutes: number
        total_minutes_this_year: number
        total_songs: number
    }

    type CurrentlyListening = {
        id: number
        song_id: string
        user_id: string
        start: string
        end: string
        source: string
        skipped: boolean
        timestamp: string
        image: string
    }

    type Album = {
        album: string
        artist: string
        listens: number
        top_song: string
        top_song_image: string
        top_song_id: string
    }

    type Artist = {
        name: string
        listens: number
    }

    type CountedSong = {
        name: string
        artist: string
        album: string
        listens: number
        image: string
        id: string
    }

    type SongDay = {
        day: string
        song: string
        artist: string
        album: string
        image: string
        listens: number
        total_songs_played: number
        id: string
    }

    type ActiveUser = {
        user: string
        total_minutes: number
        image: string
    }

    type TopXSong = {
        song: string
        artist: string
        album: string
        image: string
        id: string
        listens: number
    }

    type MusicUser = {
        name: string
        avatar: string
        user_id: string
        songs_played: number
    }

    type MusicSkipUser = {
        name: string
        avatar: string
        user_id: string
        songs_skipped: number
    }

    type LikedAlbum = {
        album: string
        artist: string
        total_listens: number
        total_skips: number
        like_ratio: number
        image: string
    }

    type LikedArtist = {
        artist: string
        total_listens: number
        total_skips: number
        like_ratio: number
        image: string
    }

    type LikedSong = {
        song: string
        artist: string
        album: string
        skips: number
        listens: number
        image: string
        like_ratio: number
    }

    type SkippedAlbum = {
        album: string
        artist: string
        skips: number
        top_song: string
        top_song_image: string
        id: string
    }

    type SkippedArtist = {
        artist: string
        skips: string
        top_song: string
        album: string
        image: string
        id: string
    }

    type SkippedSong = {
        song: string
        artist: string
        album: string
        skips: number
        image: string
        id: string
    }

    type ArtistPlayed = {
        artist: string
        listens: number
        top_song: string
        album: string
        image: string
        id: string
    }

    type Game = {
        name: string
        user: string
        userId: string
        avatar: string
        details?: string
        state?: string
        application?: string
        start: string
        party?: string
        image?: string
        imageText?: string
    }
}
