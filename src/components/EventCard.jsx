import React from 'react'

export default function EventCard({ event, onMakeSwappable, onDelete, onToggleStatus }) {
  const { id, title, startTime, endTime, status } = event

  return (
    <div className="event-card">
      <div className="event-info">
        <h4 className="event-title">{title}</h4>
        <div className="event-times">
          <time>{new Date(startTime).toLocaleString()}</time>
          <span> → </span>
          <time>{new Date(endTime).toLocaleString()}</time>
        </div>
        <div className="event-meta">
          <span className={`badge status-${status.toLowerCase()}`}>{status}</span>
        </div>
      </div>

      <div className="event-actions">
        {status === 'BUSY' && (
          <button className="btn" onClick={() => onMakeSwappable(id)}>
            Make Swappable
          </button>
        )}

        {status === 'SWAPPABLE' && (
          <>
            <button className="btn" onClick={() => onToggleStatus(id, 'BUSY')}>
              Mark Busy
            </button>
            <button className="btn" onClick={() => onDelete(id)}>Delete</button>
          </>
        )}

        {status === 'SWAP_PENDING' && (
          <button className="btn disabled" disabled>
            Pending
          </button>
        )}
      </div>
    </div>
  )
}
