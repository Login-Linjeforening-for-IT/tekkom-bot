import run from "@db"
import { loadSQL } from "./loadSQL"
import { schedule } from "node-cron"
import parser from "cron-parser"

export default async function cron() {
    schedule('* * * * *', async() => {
        await checkAnnouncements()
        await checkBtg()
    })
}

async function checkAnnouncements() {
    const query = (await loadSQL('getSentAnnouncements.sql'))
    const result = await run(query)
    const announcements = result.rows as RecurringAnnouncement[]
    for (const announcement of announcements) {
        if (cronTimeHasCome(announcement)) {
            await run(
                `UPDATE announcements 
                SET sent = false
                WHERE id = $1;`, 
                [announcement.id]
            )
        }
    }
}

async function checkBtg() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    await run(`DELETE FROM btg WHERE timestamp < $1;`, [oneDayAgo])
}

function cronTimeHasCome(announcement: RecurringAnnouncement) {
    const interval = announcement.interval
    const lastSent = announcement.last_sent

    try {
        const cronInterval = parser.parse(interval, { currentDate: new Date() })
        const prev = cronInterval.prev().toDate()

        if (!announcement.last_sent) {
            return true
        }

        const lastSentDate = new Date(lastSent)
        return lastSentDate < prev
    } catch (err) {
        console.error("Invalid cron expression:", interval, err)
        return false
    }
}
