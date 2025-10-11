import config from "#constants"

const { WEBHOOK_URL_ISSUE } = config

export default async function discordIssue(title: string, description: string, footer: string) {
    try {
        let data: { content?: string; embeds: any[] } = {
            embeds: [
                {
                    title: title,
                    description: description,
                    color: 0xff0000,
                    timestamp: new Date().toISOString(),
                    footer: footer ? { text: footer } : undefined
                }
            ]
        }

        const response = await fetch(WEBHOOK_URL_ISSUE ?? '', {
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
