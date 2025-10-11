import constants from '#constants'

export default async function getIssueName({issueID}: {issueID: number}): Promise<string> {
    try {
        const response = await fetch(`${constants.GITHUB_API}orgs/${constants.GITHUB_ORGANIZATION}/projectsV2/${constants.GITHUB_PROJECT_NUMBER}/items/${issueID}`, {
            headers: {
                'Authorization': `Bearer ${constants.GITHUB_TOKEN}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data.content.title || 'Unknown Issue'
    } catch (error) {
        return 'Unknown Issue'
    }
}
