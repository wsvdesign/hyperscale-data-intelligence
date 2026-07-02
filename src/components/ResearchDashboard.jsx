import { useEffect, useRef } from 'react'

export default function ResearchDashboard({ theme }) {
  const iframeRef = useRef(null)

  useEffect(() => {
    const iframe = iframeRef.current
    const send = () =>
      iframe?.contentWindow?.postMessage({ type: 'theme', theme }, window.location.origin)

    iframe?.addEventListener('load', send)
    send()
    return () => iframe?.removeEventListener('load', send)
  }, [theme])

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
