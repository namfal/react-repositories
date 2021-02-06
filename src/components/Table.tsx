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

function Table () {
    const [list, setList] = useState<IRepositoryListItem[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const response = await getRepositories()
                setList(response.search.edges)
            } catch (e) {
                console.log(e)
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
        </>
}

export default Table