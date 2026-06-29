import Nav from './Nav';

export default function ResearchDashboard() {
  return (
    <>
      <div id="toolbar">
        <h1>
          HYPERSCALE DATA CENTER <span>/ Intelligence System</span>
        </h1>
        <Nav />
      </div>

      <div style={{ paddingTop: '50px', height: '100vh' }}>
        <iframe
          title="Research Dashboard"
          src="/hyperscale_intelligence_map.html"
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </div>
    </>
  );
}