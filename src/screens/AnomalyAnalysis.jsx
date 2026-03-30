import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getRiskColor } from '../utils/riskCalculations';

export default function AnomalyAnalysis() {
  const navigate = useNavigate();
  const { anomalyAlerts, beneficiaries, transactions } = useApp();

  // Compute key indicators (mock-style percentages)
  const duplicateIds = beneficiaries.filter((b) => b.riskFactors.some((f) => f.includes('Multiple IDs') || f.includes('Duplicate'))).length;
  const duplicateIdsPct = Math.round((duplicateIds / beneficiaries.length) * 100) || 4;
  const sameBankUsage = Math.round(12 + Math.random() * 8);
  const elderlySkew = Math.round(18 + Math.random() * 10);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">Anomaly Analysis & Explainable Alerts</h1>
        <p className="text-slate-400 mt-1">Plain-language explanations of why entities are flagged — no jargon</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
          <p className="text-sm text-slate-400">% Duplicate IDs</p>
          <p className="text-3xl font-bold text-amber-400 mt-1">{duplicateIdsPct}%</p>
          <p className="text-xs text-slate-500 mt-1">Beneficiaries with multiple ID references</p>
        </div>
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
          <p className="text-sm text-slate-400">% Same Aadhaar / Bank Usage</p>
          <p className="text-3xl font-bold text-amber-400 mt-1">{sameBankUsage}%</p>
          <p className="text-xs text-slate-500 mt-1">Records sharing bank or Aadhaar</p>
        </div>
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
          <p className="text-sm text-slate-400">Elderly Age Skew</p>
          <p className="text-3xl font-bold text-amber-400 mt-1">{elderlySkew}%</p>
          <p className="text-xs text-slate-500 mt-1">Beneficiaries 65+ vs population norm</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-slate-200 mb-4">Why Flagged — Explainable Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {anomalyAlerts.map((alert) => {
            const colors = getRiskColor(alert.riskScore);
            const profileType = alert.type === 'village' ? 'village' : alert.type === 'district' ? 'district' : alert.type === 'block' ? 'district' : 'state';
            const profileId = alert.type === 'state' ? alert.state : alert.type === 'block' ? alert.district : alert.entity;
            return (
              <div
                key={alert.id}
                onClick={() => navigate(`/profile/${profileType}/${encodeURIComponent(profileId)}`)}
                className={`bg-slate-800/80 border rounded-xl p-6 cursor-pointer hover:bg-slate-800 transition-colors ${colors.border} border`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-200">{alert.entity}</h3>
                  <span className={`text-lg font-bold ${colors.text}`}>{alert.riskScore}%</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {alert.type} • {alert.district || ''} {alert.state}
                </p>
                <ul className="mt-4 space-y-2">
                  {alert.bullets.map((b) => (
                    <li key={b} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-slate-500">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-slate-400 italic border-t border-slate-700 pt-4">
                  {alert.reason}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
