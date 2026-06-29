import React from 'react'

export default function ResearchDashboard() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <iframe
        src="/hyperscale_data_center_map-3.html"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        title="Research Dashboard — Natalie Walker / WASIVI"
      />
    </div>
  )
}