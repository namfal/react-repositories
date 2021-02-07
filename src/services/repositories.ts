import axios from 'axios'

const BASE_URL = 'https://api.github.com/graphql'

export async function getRepositories(endCursor: null|string = null, startCursor: null|string = null) {
	const query = `
    query ($endCursor: String, $startCursor: String){ 
      rateLimit {
        cost
        remaining
        resetAt
        }
      search (query: "topic:react", type: REPOSITORY, first: 20, after: $endCursor, before: $startCursor) {
        repositoryCount
        edges {
          node {
            ... on Repository {
              id
              name
              nameWithOwner
              url
              stargazerCount
              forkCount
            }
          }
        }
        pageInfo{
            endCursor
            startCursor
            hasNextPage
            hasPreviousPage
      }
      }
    }
`
	const variables = {
		'endCursor': endCursor,
		'startCursor': startCursor
	}

	try {
		const response = await axios.post(BASE_URL, {query, variables}, {
			'headers': {
				Authorization: process.env.REACT_APP_GITHUB_TOKEN
			}
		})
		return response.data.data
	} catch (e) {
		console.error(e)
		throw new Error(`⚠️ There was an error fetching the data from URL ${BASE_URL}`)
	}
}