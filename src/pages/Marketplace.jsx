import React, { useEffect, useState } from 'react'
import api from '../api/api'
import SwapModal from '../components/SwapModal'

export default function Marketplace() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  const loadSlots = async () => {
    try {
      setLoading(true)
      const res = await api.get('/swappable-slots')
      const normalized = (res.data || []).map(s => ({ ...s, id: s.id || s._id }))
      setSlots(normalized)
    } catch (err) {
      console.error(err)
      alert('Could not load marketplace')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSlots()
  }, [])

  return (
    <div className="page">
      <h2>Marketplace — Swappable Slots</h2>
      {loading && <p>Loading…</p>}
      {!loading && slots.length === 0 && <p>No swappable slots available right now.</p>}

      <div className="market-grid">
        {slots.map(slot => (
          <div key={slot.id} className="market-card">
            <h4>{slot.title}</h4>
            <p>{new Date(slot.startTime).toLocaleString()} — {new Date(slot.endTime).toLocaleString()}</p>
            <p className="muted">Owner: {slot.ownerName || slot.ownerId}</p>
            <button className="btn btn-primary" onClick={() => setSelected(slot)}>Request Swap</button>
          </div>
        ))}
      </div>

      {selected && <SwapModal theirSlot={selected} onClose={() => { setSelected(null); loadSlots(); }} />}
    </div>
  )
}
