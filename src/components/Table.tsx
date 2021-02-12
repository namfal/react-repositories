import React, { useState, useEffect } from 'react'
import { getRepositories } from '../services/repositories'

export interface IRepositoryListItem {
    node: {
        id: string,
        nameWithOwner: string,
        url: string,
        forkCount: number,
        stargazerCount: number
    }
}

interface IPageInfo {
    endCursor: string | null,
    startCursor: string | null,
    hasNextPage: boolean,
    hasPreviousPage: boolean
}

const Table: React.FC = () => {
	const [list, setList] = useState<IRepositoryListItem[]>([])
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [pageInfo, setPageInfo] = useState<IPageInfo>({
		endCursor: null,
		startCursor: null,
		hasNextPage: false,
		hasPreviousPage: false
	})
	const [pageCount, setPageCount] = useState(0)
	const [fetchNextPage, setFetchNextPage] = useState(true)

	useEffect(() => {
		(async () => {
			try {
				setLoading(true)
				const cursor = fetchNextPage ? pageInfo.endCursor : pageInfo.startCursor
				const response = await getRepositories(cursor, fetchNextPage)
				setList(response.search.edges)
				setPageInfo({...response.search.pageInfo})
			} catch (e) {
				setError(e.message)
			} finally {
				setLoading(false)
			}
		})()
	}, [pageCount])

	if (loading) {
		return <div className="loading">Loading...</div>
	} else if (error) {
		return <div className="error">{error}</div>
	}

	const nextPage = async () => {
		setPageCount(pageCount + 1)
		setFetchNextPage(true)
	}

	const previousPage = async () => {
		setPageCount(pageCount - 1)
		setFetchNextPage(false)
	}


	return <>
		<table>
			<thead>
				<tr>
					<th>Repository Name</th>
					<th>🌟 Stars</th>
					<th>🍴 Forks</th>
				</tr>
			</thead>
			<tbody>
				{list.map(listItem => {
					return <tr key={listItem.node.id}>
						<td>
							<a href={listItem.node.url} target="_blank" rel="noreferrer">
								{ listItem.node.nameWithOwner}
							</a>
						</td>
						<td>{ listItem.node.stargazerCount }</td>
						<td>{ listItem.node.forkCount }</td>
					</tr>
				})}
			</tbody>
		</table>
		<div className="pagination">
			{pageInfo.hasPreviousPage &&
                <button onClick={previousPage}>Previous Page</button>
			}
			<p>Page: { pageCount }</p>
			{pageInfo.hasNextPage &&
                <button onClick={nextPage}>Next Page</button>
			}
		</div>
	</>
}

export default Table
