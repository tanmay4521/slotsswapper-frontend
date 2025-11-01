// components/SwapModal.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function SwapModal({ theirSlot, onClose }) {
  const [mySwappable, setMySwappable] = useState([]);
  const [selectedMySlotId, setSelectedMySlotId] = useState(null);

  useEffect(() => {
    // ✅ FIX: Use the correct /events/my endpoint to fetch the user's events
    api.get('/events/my').then(resp => {
      // Filter for SWAPPABLE slots locally
      const swappableSlots = (resp.data || []).filter(e => e.status === 'SWAPPABLE');
      setMySwappable(swappableSlots);
      
      // Optionally select the first slot by default if available
      if (swappableSlots.length > 0) {
          setSelectedMySlotId(swappableSlots[0].id);
      }

    }).catch(err => {
      console.error("Error loading my slots in modal:", err);
      // It's crucial to handle errors here to prevent the uncaught promise issue
    });
  }, []);

  const submitRequest = async () => {
    if (!selectedMySlotId) {
      alert('Please select one of your swappable slots.');
      return;
    }
    
    try {
      // Correctly targets /api/swap-request
      await api.post('/swap-request', { 
        mySlotId: selectedMySlotId, 
        theirSlotId: theirSlot.id 
      });
      alert('Swap request sent successfully!');
      onClose();
    } catch (err) {
      console.error("Swap request error:", err);
      alert(err.response?.data?.message || 'Error sending swap request. Check console for details.');
    }
  };

  return (
    // Note: I assume the modal presentation logic (e.g., div className="modal") exists in App.css or similar.
    <div className="modal"> 
      <h3>Offer one of your swappable slots for: {theirSlot.title}</h3>
      {mySwappable.length === 0 ? (
          <p>You have no slots currently marked as SWAPPABLE.</p>
      ) : (
        <>
            <select onChange={(e) => setSelectedMySlotId(e.target.value)} value={selectedMySlotId || ''}>
              <option value="" disabled>Select your swappable slot</option>
              {mySwappable.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title} — {new Date(s.startTime).toLocaleString()}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={submitRequest} disabled={!selectedMySlotId}>
                Send Request
            </button>
        </>
      )}
      <button className="btn" onClick={onClose} style={{marginLeft: '8px'}}>Cancel</button>
    </div>
  );
}