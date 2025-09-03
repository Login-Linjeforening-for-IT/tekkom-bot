import { schedule } from "node-cron"
import config from "../config.js"

export default async function heartbeat() {
    try {
        schedule('* * * * *', async() => {
            const response = await fetch(config.heartbeatUrl)
            
            if (!response.ok) {
                throw new Error(await response.text())
            }

            const data = await response.json()
            return data
        })
    } catch (error) {
        console.log(error)
    }
}
