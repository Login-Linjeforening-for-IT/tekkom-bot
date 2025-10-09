import config from "#constants"

const { CRITICAL_ROLE, WEBHOOK_URL } = config

export default async function discordAlert(description: string, type: 'get' | 'post' | '' = '', ping: boolean = false) {
    try {
        let data: { content?: string; embeds: any[] } = {
            embeds: [
                {
                    title: `🐝 Tekkom Bot BTG ${`${type.toUpperCase()} `}🐝`,
                    description: description,
                    color: 0xff0000,
                    timestamp: new Date().toISOString()
                }
            ]
        }

        if (ping) {
            data.content = `🚨 <@&${CRITICAL_ROLE}> 🚨`
        }

        const response = await fetch(WEBHOOK_URL ?? '', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return response.status
    } catch (error) {
        console.log(error)
    }
}
