import config from '#constants'

const { WEBHOOK_URL_ISSUE } = config

export default async function discordIssue(title: string, description: string, footer: string, color: string) {
    try {
        let data: { content?: string; embeds: any[] } = {
            embeds: [
                {
                    title: title,
                    description: description,
                    color: getColor(color),
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
        throw error
    }
}

function getColor(name: string) {
    switch (name.toLowerCase()) {
        case 'blue':
            return '#4493f8'
        case 'green':
            return '#3fb950'
        case 'yellow':
            return '#d29922'
        case 'orange':
            return '#db6d28'
        case 'red':
            return '#f85149'
        case 'pink':
            return '#db61a2'
        case 'purple':
            return '#ab7df8'
        default:
            return '#9198a1'
    }
}