import React, { useEffect, useState } from 'react'
import api from '../api/api'
import EventCard from '../components/EventCard'
// Removed redundant import of axios

export default function Dashboard() {
    const [events, setEvents] = useState([])
    const [form, setForm] = useState({ title: '', startTime: '', endTime: '' })
    const [loading, setLoading] = useState(false)

    const loadEvents = async () => {
        try {
            setLoading(true)
            
            // ✅ FIX: Correct endpoint for fetching YOUR events is /events/my
            const res = await api.get('/events/my') 
            
            const normalized = (res.data || []).map(e => ({ ...e, id: e.id || e._id }))
            setEvents(normalized)
        } catch (err) {
            console.error('Load events error', err)
            alert('Unable to load events')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadEvents()
    }, [])

    const createEvent = async e => {
        e.preventDefault()
        try {
            const payload = {
                title: form.title,
                startTime: new Date(form.startTime).toISOString(),
                endTime: new Date(form.endTime).toISOString(),
                status: 'BUSY',
            }
            // Correctly targets /api/events
            await api.post('/events', payload) 
            setForm({ title: '', startTime: '', endTime: '' })
            loadEvents()
        } catch (err) {
            console.error(err)
            alert('Error creating event')
        }
    }

    const makeSwappable = async id => {
        try {
            // ✅ FIX: Use the correct /status endpoint for PUT requests
            await api.put(`/events/${id}/status`, { status: 'SWAPPABLE' })
            loadEvents()
        } catch (err) {
            console.error(err)
            alert('Could not mark swappable')
        }
    }

    const toggleStatus = async (id, newStatus) => {
        try {
            // ✅ FIX: Use the correct /status endpoint for PUT requests
            await api.put(`/events/${id}/status`, { status: newStatus })
            loadEvents()
        } catch (err) {
            console.error(err)
            alert('Could not update status')
        }
    }

    const deleteEvent = async id => {
        if (!confirm('Delete this event?')) return
        try {
            await api.delete(`/events/${id}`)
            loadEvents()
        } catch (err) {
            console.error(err)
            alert('Could not delete event')
        }
    }

    return (
        <div className="page">
        <h2>My Calendar</h2>

        <section className="create-section">
            <form onSubmit={createEvent} className="create-form">
            <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
            />
            <input
                type="datetime-local"
                value={form.startTime}
                onChange={e => setForm({ ...form, startTime: e.target.value })}
                required
            />
            <input
                type="datetime-local"
                value={form.endTime}
                onChange={e => setForm({ ...form, endTime: e.target.value })}
                required
            />
            <button type="submit" className="btn btn-primary">Add Event</button>
            </form>
        </section>

        <section className="events-section">
            <h3>Your events</h3>

            {loading && <p>Loading…</p>}
            {!loading && events.length === 0 && <p>No events yet. Create one above.</p>}

            <div className="events-grid">
            {events.map(ev => (
                <EventCard
                key={ev.id}
                event={ev}
                onMakeSwappable={makeSwappable}
                onDelete={deleteEvent}
                onToggleStatus={toggleStatus}
                />
            ))}
            </div>
        </section>
        </div>
    )
}