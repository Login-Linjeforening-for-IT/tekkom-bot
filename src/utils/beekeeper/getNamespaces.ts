import config from "../config.js"

export default async function getNamespaces(): Promise<any[]> {
    try {
        const response = await fetch(`${config.beekeeperApiUrl}/namespaces`)

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
        return []
    }
}
