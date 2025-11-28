import React from 'react'

export default function Feedback ({ message, status }) {
    if (!message) {
        return null
    }
    if (status === 'error') {
        return (
            <div className="error">
                {message}
            </div>
        )
    }
    return (
        <div className="success">
            {message}
        </div>
    )
}