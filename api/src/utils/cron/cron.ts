import { schedule } from "node-cron"
import checkAnnouncements from './checks/announcements'
import checkBtg from './checks/btg'
import checkMaxConnections from './checks/maxConnections'

export default async function cron() {
    schedule('* * * * *', async() => {
        await checkMaxConnections()
        await checkAnnouncements()
        await checkBtg()
    })
}
