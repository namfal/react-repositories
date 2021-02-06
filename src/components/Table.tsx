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

    useEffect(() => {
        (async () => {
            const response = await getRepositories()
            console.log(response)
            setList(response.search.edges)
        })()
    }, [])


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