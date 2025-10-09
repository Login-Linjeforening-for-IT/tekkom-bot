import { schedule } from "node-cron"
import checkAnnouncements from './checks/announcements.ts'
import checkBtg from './checks/btg.ts'
import checkMaxConnections from './checks/maxConnections.ts'

export default async function cron() {
    schedule('* * * * *', async() => {
        await checkMaxConnections()
        await checkAnnouncements()
        await checkBtg()
    })
}
