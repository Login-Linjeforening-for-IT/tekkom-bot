import { GITHUB_API, GITHUB_ORGANIZATION } from '#constants'
import config from '#config'
import logNullValue from '#utils/logNullValue.ts'

interface PostIssueParams {
    title: string
    body: string
    type: string
}

export default async function postIssue( repo: string, params: PostIssueParams ): Promise<number> {
    try {
        logNullValue('postIssue', ['repo', 'title', 'body', 'type'], [repo, params.title, params.body, params.type])

        const issueData = {
            title: params.title,
            body: params.body,
            type: params.type
        }

        const response = await fetch(`${GITHUB_API}repos/${GITHUB_ORGANIZATION}/${repo}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.githubToken}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(issueData)
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
