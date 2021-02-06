import axios from 'axios'

const BASE_URL = 'https://api.github.com/graphql'

export async function getRepositories() {
    const query = `
    query { 
      rateLimit {
        cost
        remaining
        resetAt
        }
      search (query: "topic:react", type: REPOSITORY, first: 20, after: null) {
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

    try {
        const response = await axios.post(BASE_URL, {query}, {
            'headers': {
                Authorization: process.env.REACT_APP_GITHUB_TOKEN
            }
        })
        return response.data.data
    } catch (e) {
        console.error(e)
        return `Unable to fetch the list from URL ${BASE_URL}`
    }
}