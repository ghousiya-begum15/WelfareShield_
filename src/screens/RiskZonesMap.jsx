import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useApp } from '../context/AppContext';
import { INDIA_STATES_GEO } from '../data/mockData';
import { getRiskColor } from '../utils/riskCalculations';
import 'leaflet/dist/leaflet.css';

// India center view
const INDIA_CENTER = [20.5937, 78.9629];
const INDIA_ZOOM = 5;

export default function RiskZonesMap() {
  const navigate = useNavigate();
  const { beneficiaries, transactions } = useApp();
  const [selectedRegion, setSelectedRegion] = useState(null);

  const regionData = useMemo(() => {
    return INDIA_STATES_GEO.map((state) => {
      const stateBeneficiaries = beneficiaries.filter((b) => b.location.state === state.name);
      const stateTransactions = transactions.filter((t) => t.location.state === state.name);
      const highRisk = stateBeneficiaries.filter((b) => b.riskScore >= 70).length;
      return {
        ...state,
        highRiskCount: highRisk,
        beneficiaryCount: stateBeneficiaries.length || state.beneficiaryCount,
        flaggedCount: stateTransactions.length || state.flaggedCount,
      };
    });
  }, [beneficiaries, transactions]);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">Risk Zones Map</h1>
        <p className="text-slate-400 mt-1">
          Interactive map of India — click a region to drill down (State → District → Block → Village)
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[500px] bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden">
          <MapContainer
            center={INDIA_CENTER}
            zoom={INDIA_ZOOM}
            className="h-full w-full"
            style={{ background: '#1e293b' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {regionData.map((region) => {
              const colors = getRiskColor(region.riskIndex);
              const fillColor = region.riskIndex < 40 ? '#22c55e' : region.riskIndex < 70 ? '#eab308' : '#ef4444';
              return (
                <CircleMarker
                  key={region.code}
                  center={[region.lat, region.lng]}
                  radius={region.riskIndex / 5 + 4}
                  pathOptions={{
                    fillColor,
                    color: '#fff',
                    weight: 1,
                    opacity: 0.9,
                    fillOpacity: 0.7,
                  }}
                  eventHandlers={{
                    click: () => handleRegionClick(region),
                  }}
                >
                  <Popup>
                    <div className="text-slate-800 min-w-[180px]">
                      <p className="font-semibold">{region.name}</p>
                      <p className="text-sm mt-1">Risk Score: {region.riskIndex}</p>
                      <p className="text-sm">Anomaly Rate: {region.anomalyRate}%</p>
                      <p className="text-sm">Flagged: {region.flaggedCount}</p>
                      <p className="text-sm">Beneficiaries: {region.beneficiaryCount}</p>
                      <p className="text-xs text-slate-600 mt-2">Click to view profile →</p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-slate-200">Legend</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-400">Low Risk (&lt;40)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-500" />
              <span className="text-sm text-slate-400">Medium Risk (40–70)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-sm text-slate-400">High Risk (&gt;70)</span>
            </div>
          </div>

          {selectedRegion ? (
            <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-lg">
              <h3 className="font-medium text-slate-200">{selectedRegion.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-slate-400">
                <p>Risk Index: {selectedRegion.riskIndex}</p>
                <p>Anomaly Rate: {selectedRegion.anomalyRate}%</p>
                <p>Flagged: {selectedRegion.flaggedCount}</p>
                <p>Beneficiaries: {selectedRegion.beneficiaryCount}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/profile/state/${encodeURIComponent(selectedRegion.name)}`)}
                className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
              >
                View full profile →
              </button>
            </div>
          ) : (
            <p className="mt-6 text-sm text-slate-500">Click a region on the map to view details and drill down.</p>
          )}
        </div>
      </div>
    </div>
  );
}
