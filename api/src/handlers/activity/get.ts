import run from "@/db"
import { loadSQL } from "@utils/loadSQL"
import { FastifyReply, FastifyRequest } from "fastify"

type GetActivites = {
    id?: string
    page: string
    activitiesPerPage: string
}

export default async function getActivity(req: FastifyRequest, res: FastifyReply) {
    const { id } =  (req.query as GetActivites) ?? {}
    // nothing to search atm
    // const { id, page, activitiesPerPage } =  (req.query as GetActivites) ?? {}

    if (id) {
        const result = await run(`SELECT * FROM activites WHERE id = $1;`, [id])
        return res.send(result.rows)
    }

    const getAverageDurationPerSong = (await loadSQL('getAverageDurationPerSong.sql'))
    const getCurrentlyPlaying = (await loadSQL('getCurrentlyPlaying.sql'))
    const getMostPlayedAlbums = (await loadSQL('getMostPlayedAlbums.sql'))
    const getMostPlayedArtists = (await loadSQL('getMostPlayedArtists.sql'))
    const getMostPlayedSongs = (await loadSQL('getMostPlayedSongs.sql'))
    const getSongsPlayedPerDay = (await loadSQL('getSongsPlayedPerDay.sql'))
    const getTopFiveToday = (await loadSQL('getTopFiveSongsToday.sql'))
    const getTopFiveYesterday = (await loadSQL('getTopFiveSongsYesterday.sql'))
    const getTopFiveThisWeek = (await loadSQL('getTopFiveSongsThisWeek.sql'))
    const getTopFiveThisMonth = (await loadSQL('getTopFiveSongsThisMonth.sql'))
    const getTopFiveThisYear = (await loadSQL('getTopFiveSongsThisYear.sql'))
    const getMostActiveUsers = (await loadSQL('getMostActiveUsers.sql'))
    
    const stats = (await run(getAverageDurationPerSong)).rows[0]
    const currentlyPlaying = (await run(getCurrentlyPlaying)).rows
    const mostPlayedAlbums = (await run(getMostPlayedAlbums)).rows
    const mostPlayedArtists = (await run(getMostPlayedArtists)).rows
    const mostPlayedSongs = (await run(getMostPlayedSongs)).rows
    const mostPlayedSongsPerDay = (await run(getSongsPlayedPerDay)).rows
    const topFiveToday = (await run(getTopFiveToday)).rows
    const topFiveYesterday = (await run(getTopFiveYesterday)).rows
    const topFiveThisWeek = (await run(getTopFiveThisWeek)).rows
    const topFiveThisMonth = (await run(getTopFiveThisMonth)).rows
    const topFiveThisYear = (await run(getTopFiveThisYear)).rows
    const mostActiveUsers = (await run(getMostActiveUsers)).rows

    // nothing to search atm
    // const pageInt = parseInt(page || "1", 10)
    // const perPageInt = parseInt(activitiesPerPage || "10", 10)
    res.send({
        stats,
        currentlyPlaying,
        mostPlayedAlbums,
        mostPlayedArtists,
        mostPlayedSongs,
        mostPlayedSongsPerDay,
        topFiveToday,
        topFiveYesterday,
        topFiveThisWeek,
        topFiveThisMonth,
        topFiveThisYear
    })
}
