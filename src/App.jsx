import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HubMap from './components/HubMap';
import HybridMap from './components/HybridMap';
import Timeline from './components/Timeline';
import GrowthPressure from './components/GrowthPressure';
import DataQuery from './components/DataQuery';
import Home from './components/Home';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('hdi-theme');
    return savedTheme === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hdi-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-pressed={theme === 'light'}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hub-map" element={<HubMap />} />
          <Route path="/hybrid-map" element={<HybridMap />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/growth-pressure" element={<GrowthPressure />} />
          <Route path="/data-query" element={<DataQuery />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
