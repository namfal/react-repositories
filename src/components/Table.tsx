import React, { useState, useEffect } from 'react'

function Table () {
    return <>
            <table>
                <thead>
                    <tr>
                        <th>repository</th>
                        <th>stars</th>
                        <th>forks</th>
                    </tr>
                </thead>
                <tbody>
                    <td>repository</td>
                    <td>stars</td>
                    <td>forks</td>
                </tbody>
            </table>
        </>
}

export default Table