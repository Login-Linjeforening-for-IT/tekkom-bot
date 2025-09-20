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
        user: string
        song: string
        artist: string
        start: string
        end: string
        album: string
        image: string
        source: string
        avatar: string
        user_id: string
        skipped: boolean
    }

    type Music = {
        stats: MusicStats
        currentlyPlaying: Song[]
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
    }

    type MusicStats = {
        avg_seconds: number
        total_minutes: number
        total_minutes_this_year: number
        total_songs: number
    }

    type Song = {
        id: number
        song: string
        artist: string
        album: string
        start: string
        end: string
        source: string
        user: string
        timestamp: string
        image: string
        listens: number
    }

    type Album = {
        album: string
        artist: string
        listens: string
        top_song: string
        top_song_image: string
    }

    type Artist = {
        name: string
        listens: string
    }

    type CountedSong = {
        song: string
        artist: string
        album: string
        listens: number
        image: string
    }

    type SongDay = {
        day: string
        songs_played: string
        albums: Album[]
    }

    type ActiveUser = {
        user: string
        total_minutes: string
        image: string
    }

    type TopXSong = {
        song: string
        artist: string
        album: string
        listens: string
        image: string
    }

    type MusicUser = {
        name: string
        avatar: string
        user_id: string
        songs_played: string
    }

    type LikedAlbum = {
        album: string
        artist: string
        total_listens: string
        total_skips: string
        like_ratio: number
        image: string
    }

    type LikedArtist = {
        artist: string
        total_listens: string
        total_skips: string
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
    }

    type SkippedArtist = {
        artist: string
        skips: number
        top_song: null
        album: null
        image: string
    }

    type SkippedSong = {
        song: string
        artist: string
        album: string
        skips: number
        image: string
    }

    type ArtistPlayed = {
        artist: string
        listens: string
        top_song: string
        album: string
        image: string
    }
}
