import constants from '#constants'

export default async function getIssueInfo(itemNodeId: string): Promise<{ issueTitle: string; repoName: string; projectName: string }> {
    const query = `
        query($nodeId: ID!) {
            node(id: $nodeId) {
                ... on ProjectV2Item {
                    content {
                        ... on Issue {
                            title
                            repository {
                                name
                            }
                        }
                    }
                    project {
                        title
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch(`${constants.GITHUB_API}graphql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${constants.GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                variables: { nodeId: itemNodeId }
            })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();
        const issueTitle = data.data.node?.content?.title || 'Unknown Issue';
        const repoName = data.data.node?.content?.repository?.name || 'Unknown Repo';
        const projectName = data.data.node?.project?.title || 'Unknown Project';
        return { issueTitle, repoName, projectName };
    } catch (error) {
        return { issueTitle: 'Unknown Issue', repoName: 'Unknown Repo', projectName: 'Unknown Project' };
    }
}
