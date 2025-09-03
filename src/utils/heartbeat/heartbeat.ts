import { schedule } from "node-cron"

export default async function heartbeat() {
    try {
        schedule('* * * * *', async() => {
            const response = await fetch('https://status.login.no/api/push/uzA7ya2YkA?status=up&msg=OK&ping=')
            
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
