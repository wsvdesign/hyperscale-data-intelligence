import { Navigate, Route, Routes } from 'react-router-dom';
import HubMap from './components/HubMap';
import HybridMap from './components/HybridMap';
import Timeline from './components/Timeline';
import GrowthPressure from './components/GrowthPressure';
import DataQuery from './components/DataQuery';
import Home from './components/Home';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hub-map" element={<HubMap />} />
        <Route path="/hybrid-map" element={<HybridMap />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/growth-pressure" element={<GrowthPressure />} />
        <Route path="/data-query" element={<DataQuery />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
