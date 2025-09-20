import run from '@db'
import { loadSQL } from "@utils/loadSQL"

export async function preloadActivityQueries() {
    const [
        getAverageDurationPerSong,
        getCurrentlyPlaying,
        getMostPlayedAlbums,
        getMostPlayedArtists,
        getMostPlayedSongs,
        getSongsPlayedPerDay,
        getTopFiveToday,
        getTopFiveYesterday,
        getTopFiveThisWeek,
        getTopFiveLastWeek,
        getTopFiveThisMonth,
        getTopFiveLastMonth,
        getTopFiveThisYear,
        getTopFiveLastYear,
        getMostActiveUsers,
        getMostLikedAlbums,
        getMostLikedArtists,
        getMostLikedSongs,
        getMostSkippedAlbums,
        getMostSkippedArtists,
        getMostSkippedSongs
    ] = await Promise.all([
        loadSQL('getAverageDurationPerSong.sql'),
        loadSQL('getCurrentlyPlaying.sql'),
        loadSQL('getMostPlayedAlbums.sql'),
        loadSQL('getMostPlayedArtists.sql'),
        loadSQL('getMostPlayedSongs.sql'),
        loadSQL('getSongsPlayedPerDay.sql'),
        loadSQL('getTopFiveSongsToday.sql'),
        loadSQL('getTopFiveSongsYesterday.sql'),
        loadSQL('getTopFiveSongsThisWeek.sql'),
        loadSQL('getTopFiveSongsLastWeek.sql'),
        loadSQL('getTopFiveSongsThisMonth.sql'),
        loadSQL('getTopFiveSongsLastMonth.sql'),
        loadSQL('getTopFiveSongsThisYear.sql'),
        loadSQL('getTopFiveSongsLastYear.sql'),
        loadSQL('getMostActiveUsers.sql'),
        loadSQL('getMostLikedAlbums.sql'),
        loadSQL('getMostLikedArtists.sql'),
        loadSQL('getMostLikedSongs.sql'),
        loadSQL('getMostSkippedAlbums.sql'),
        loadSQL('getMostSkippedArtists.sql'),
        loadSQL('getMostSkippedSongs.sql')
    ])

    const [
        statsResult,
        currentlyPlayingResult,
        mostPlayedAlbumsResult,
        mostPlayedArtistsResult,
        mostPlayedSongsResult,
        mostPlayedSongsPerDayResult,
        topFiveTodayResult,
        topFiveYesterdayResult,
        topFiveThisWeekResult,
        topFiveLastWeekResult,
        topFiveThisMonthResult,
        topFiveLastMonthResult,
        topFiveThisYearResult,
        topFiveLastYearResult,
        mostActiveUsersResult,
        mostLikedAlbumsResult,
        mostLikedArtistsResult,
        mostLikedSongsResult,
        mostSkippedAlbumsResult,
        mostSkippedArtistsResult,
        mostSkippedSongsResult
    ] = await Promise.all([
        run(getAverageDurationPerSong),
        run(getCurrentlyPlaying),
        run(getMostPlayedAlbums),
        run(getMostPlayedArtists),
        run(getMostPlayedSongs),
        run(getSongsPlayedPerDay),
        run(getTopFiveToday),
        run(getTopFiveYesterday),
        run(getTopFiveThisWeek),
        run(getTopFiveLastWeek),
        run(getTopFiveThisMonth),
        run(getTopFiveLastMonth),
        run(getTopFiveThisYear),
        run(getTopFiveLastYear),
        run(getMostActiveUsers),
        run(getMostLikedAlbums),
        run(getMostLikedArtists),
        run(getMostLikedSongs),
        run(getMostSkippedAlbums),
        run(getMostSkippedArtists),
        run(getMostSkippedSongs)
    ])

    const stats = statsResult.rows[0]
    const currentlyPlaying = currentlyPlayingResult.rows
    const mostPlayedAlbums = mostPlayedAlbumsResult.rows
    const mostPlayedArtists = mostPlayedArtistsResult.rows
    const mostPlayedSongs = mostPlayedSongsResult.rows
    const mostPlayedSongsPerDay = mostPlayedSongsPerDayResult.rows
    const topFiveToday = topFiveTodayResult.rows
    const topFiveYesterday = topFiveYesterdayResult.rows
    const topFiveThisWeek = topFiveThisWeekResult.rows
    const topFiveLastWeek = topFiveLastWeekResult.rows
    const topFiveThisMonth = topFiveThisMonthResult.rows
    const topFiveLastMonth = topFiveLastMonthResult.rows
    const topFiveThisYear = topFiveThisYearResult.rows
    const topFiveLastYear = topFiveLastYearResult.rows
    const mostActiveUsers = mostActiveUsersResult.rows
    const mostLikedAlbums = mostLikedAlbumsResult.rows
    const mostLikedArtists = mostLikedArtistsResult.rows
    const mostLikedSongs = mostLikedSongsResult.rows
    const mostSkippedAlbums = mostSkippedAlbumsResult.rows
    const mostSkippedArtists = mostSkippedArtistsResult.rows
    const mostSkippedSongs = mostSkippedSongsResult.rows

    return {
        stats,
        currentlyPlaying,
        mostPlayedAlbums,
        mostPlayedArtists,
        mostPlayedSongs,
        mostPlayedSongsPerDay,
        topFiveToday,
        topFiveYesterday,
        topFiveThisWeek,
        topFiveLastWeek,
        topFiveThisMonth,
        topFiveLastMonth,
        topFiveThisYear,
        topFiveLastYear,
        mostActiveUsers,
        mostLikedAlbums,
        mostLikedArtists,
        mostLikedSongs,
        mostSkippedAlbums,
        mostSkippedArtists,
        mostSkippedSongs
    }
}
