import React, { useEffect, useState } from 'react'
import api from '../api/api'

export default function Requests() {
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])
  const [loading, setLoading] = useState(false)

  const loadRequests = async () => {
    try {
      setLoading(true)
      const inc = await api.get('/swap-requests/incoming')
      const out = await api.get('/swap-requests/outgoing')
      const normalize = arr => (arr.data || []).map(r => ({ ...r, id: r.id || r._id }))
      setIncoming(normalize(inc))
      setOutgoing(normalize(out))
    } catch (err) {
      console.error(err)
      alert('Could not load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const respond = async (requestId, accept) => {
    try {
      await api.post(`/swap-response/${requestId}`, { accept })
      loadRequests()
      // optionally refresh events page if user on dashboard
    } catch (err) {
      console.error(err)
      alert('Could not respond to request')
    }
  }

  return (
    <div className="page">
      <h2>Swap Requests</h2>
      {loading && <p>Loading…</p>}

      <section>
        <h3>Incoming</h3>
        {incoming.length === 0 && <p>No incoming requests.</p>}
        <ul className="requests-list">
          {incoming.map(r => (
            <li key={r.id} className="request-item">
              <div>
                <strong>{r.requesterName || r.requesterId}</strong> offered <em>{r.mySlotTitle || r.mySlotId}</em> for your <em>{r.theirSlotTitle || r.theirSlotId}</em>
                <div className="muted">Status: {r.status}</div>
              </div>
              <div className="request-actions">
                {r.status === 'PENDING' && (
                  <>
                    <button className="btn btn-primary" onClick={() => respond(r.id, true)}>Accept</button>
                    <button className="btn" onClick={() => respond(r.id, false)}>Reject</button>
                  </>
                )}
                {r.status !== 'PENDING' && <span className="muted"> {r.status} </span>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Outgoing</h3>
        {outgoing.length === 0 && <p>No outgoing requests.</p>}
        <ul className="requests-list">
          {outgoing.map(r => (
            <li key={r.id} className="request-item">
              <div>
                You offered <em>{r.mySlotTitle || r.mySlotId}</em> for <strong>{r.responderName || r.responderId}</strong>'s <em>{r.theirSlotTitle || r.theirSlotId}</em>
                <div className="muted">Status: {r.status}</div>
              </div>
              <div className="request-actions">
                {r.status === 'PENDING' && <span className="muted">Pending…</span>}
                {r.status !== 'PENDING' && <span className="muted">{r.status}</span>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
