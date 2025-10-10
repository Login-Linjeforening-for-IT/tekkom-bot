import { GITHUB_API, GITHUB_ORGANIZATION, DEV_PROJECT_ID, INFRA_PROJECT_ID } from '#constants'
import config from '#config'
import logNullValue from '#utils/logNullValue.ts'

export default async function postProjectItem( project: 'dev' | 'infra', issueID: number ): Promise<number> {
    try {
        logNullValue('postProjectItem', ['project', 'id'], [project, issueID])

        const itemData = {
            type: 'Issue',
            id: issueID,
        }

        const id = project === 'dev' ? DEV_PROJECT_ID : INFRA_PROJECT_ID

        const response = await fetch(`${GITHUB_API}/orgs/${GITHUB_ORGANIZATION}/projectsV2/${id}/items`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.githubToken}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data.id
    } catch (error) {
        if (!JSON.stringify(error).includes('Skipped')) {
            console.log(error)
        }

        throw error
    }
}
