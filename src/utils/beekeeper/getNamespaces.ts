import { BEEKEEPER_API } from "../../constants.js"

export default async function getNamespaces(): Promise<any[]> {
    try {
        const response = await fetch(`${BEEKEEPER_API}/namespaces`)

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
