import React, { useEffect, useRef } from 'react'
import Nav from './Nav'

export default function ResearchDashboard({ theme }) {
  const iframeRef = useRef(null)
  const isLight = document.documentElement.getAttribute('data-theme') === 'light'

  useEffect(() => {
    const iframe = iframeRef.current
    const send = () =>
      iframe?.contentWindow?.postMessage({ type: 'theme', theme }, window.location.origin)

    iframe?.addEventListener('load', send)
    send()
    return () => iframe?.removeEventListener('load', send)
  }, [theme])

  return (
    <div className="research-page" style={{ position: 'fixed', inset: 0, background: isLight ? '#f3f6fb' : '#07080f' }}>
      <div
        id="toolbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '52px',
          zIndex: 300,
          background: isLight ? 'rgba(243,246,251,.98)' : 'rgba(7,8,15,.98)',
          borderBottom: isLight ? '1px solid rgba(15,23,42,.14)' : '1px solid rgba(255,255,255,.07)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          gap: '10px',
        }}
      >
        <h1
          style={{
            fontSize: '9.5px',
            fontWeight: 700,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            flex: 1,
            whiteSpace: 'nowrap',
            color: isLight ? '#0f172a' : '#e8e9f0',
            fontFamily: "'Space Mono', monospace",
            margin: 0,
          }}
        >
          HYPERSCALE DATA CENTER <span style={{ color: isLight ? '#64748b' : '#8792b3', fontWeight: 400 }}>/ Research</span>
        </h1>
        <Nav />
      </div>
      <iframe
        ref={iframeRef}
        src="/hyperscale_data_center_map-3.html"
        style={{
          position: 'fixed',
          top: 52,
          left: 0,
          width: '100%',
          height: 'calc(100% - 52px)',
          border: 'none'
        }}
        title="Research Dashboard — Natalie Walker / WASIVI"
      />
    </div>
  )
}
