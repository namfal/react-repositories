import axios from 'axios'

const BASE_URL = 'https://api.github.com/graphql'
// endCursor: null|string = null, startCursor: null|string = null, fetchNextPage: boolean
export async function getRepositories(cursor: null|string = null, fetchNextPage: boolean) {
	const query = `
    query ($cursor: String){ 
      search (query: "topic:react", type: REPOSITORY, ${fetchNextPage ? 'first' :'last'}: 20, ${fetchNextPage ? 'after' :'before'} : $cursor) {
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
		'cursor': cursor
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
