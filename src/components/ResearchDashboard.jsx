import React, { useEffect, useRef } from 'react'

export default function ResearchDashboard() {
  const iframeRef = useRef(null)

  useEffect(() => {
    const iframe = iframeRef.current

    const sendTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark'
      iframe?.contentWindow?.postMessage({ type: 'theme', theme }, '*')
    }

    iframe?.addEventListener('load', sendTheme)

    const observer = new MutationObserver(sendTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      iframe?.removeEventListener('load', sendTheme)
      observer.disconnect()
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <iframe
        ref={iframeRef}
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
