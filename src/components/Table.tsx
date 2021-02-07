import React, { useState, useEffect } from 'react'
import { getRepositories } from '../services/repositories'

interface IRepositoryListItem {
    node: {
        id: string,
        nameWithOwner: string,
        url: string,
        forkCount: number,
        stargazerCount: number
    }
}

interface IPageInfo {
    endCursor: string,
    startCursor: string,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    pageCount: number
}

function Table () {
	const [list, setList] = useState<IRepositoryListItem[]>([])
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [pageInfo, setPageInfo] = useState<IPageInfo>({
		endCursor: '',
		startCursor: '',
		hasNextPage: false,
		hasPreviousPage: false,
		pageCount: 0
	})

	useEffect(() => {
		(async () => {
			try {
				setLoading(true)
				const response = await getRepositories()
				setList(response.search.edges)
				setPageInfo({...response.search.pageInfo, pageCount: 0})
			} catch (e) {
				setError(e.message)
			} finally {
				setLoading(false)
			}
		})()
	}, [])

	if (loading) {
		return <div className="loading">Loading...</div>
	} else if (error) {
		return <div className="error">{error}</div>
	}

	const nextPage = async () => {
		try {
			setLoading(true)
			const response = await getRepositories(pageInfo.endCursor)
			setList(response.search.edges)
			const pageCount = pageInfo.pageCount + 1
			setPageInfo({...response.search.pageInfo, pageCount})
		} catch (e) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	const previousPage = async () => {
		try {
			setLoading(true)
			const response = await getRepositories(null, pageInfo.startCursor)
			setList(response.search.edges)
			const pageCount = pageInfo.pageCount - 1
			setPageInfo({...response.search.pageInfo, pageCount})
		} catch (e) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
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
			<p>Page: { pageInfo.pageCount }</p>
			{pageInfo.hasNextPage &&
                <button onClick={nextPage}>Next Page</button>
			}
		</div>
	</>
}

export default Table