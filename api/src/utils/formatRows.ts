import getWeek from './getWeek'

export default function formatRows(rows: Announcement[]) {
    const now = new Date()
    const year = now.getFullYear()
    const week = getWeek()
    return rows.map((row) => row.description
        .replaceAll(/{week}/g, week.toString())
        .replaceAll(/{year}/g, year.toString())
    )
}
