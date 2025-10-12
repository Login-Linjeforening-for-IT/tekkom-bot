import constants from '#constants'

export default async function getProjectName(projectNodeId: string): Promise<string> {
    const query = `
        query($nodeId: ID!) {
            node(id: $nodeId) {
                ... on ProjectV2 {
                    title
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
                variables: { nodeId: projectNodeId }
            })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();
        return data.data.node?.title || 'Unknown Project';
    } catch (error) {
        return 'Unknown Project';
    }
}
