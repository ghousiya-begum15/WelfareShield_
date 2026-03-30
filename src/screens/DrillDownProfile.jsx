import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getRiskColor, getSeverityColor } from '../utils/riskCalculations';
import { INDIA_STATES_GEO } from '../data/mockData';

export default function DrillDownProfile() {
  const { entityType, id } = useParams();
  const navigate = useNavigate();
  const { beneficiaries, transactions } = useApp();
  const decodedId = decodeURIComponent(id);

  // Resolve entity data based on type
  const entity = (() => {
    if (entityType === 'beneficiary') {
      const b = beneficiaries.find((x) => x.id === decodedId);
      if (!b) return null;
      return {
        type: 'Beneficiary',
        name: b.name,
        hierarchy: `${b.location.village} → ${b.location.block} → ${b.location.district} → ${b.location.state}`,
        schemes: b.schemes,
        riskScore: b.riskScore,
        riskBreakdown: {
          duplicateIds: Math.round(b.riskScore * 0.35),
          flaggedTxns: Math.round(b.riskScore * 0.25),
          regionalAnomalies: Math.round(b.riskScore * 0.2),
          populationDeviation: Math.round(b.riskScore * 0.2),
        },
        flags: Array.from({ length: b.flags || 2 }, (_, i) => ({
          date: new Date(2024, 10 - i, 15).toISOString().split('T')[0],
          type: ['Duplicate Bank', 'Multiple IDs', 'Unusual pattern'][i % 3],
          severity: ['high', 'medium', 'low'][i % 3],
        })),
        linkedTransactions: transactions.filter((t) => t.beneficiaryId === b.id).slice(0, 5),
        reasonTags: b.riskFactors,
        ...b,
      };
    }
    if (entityType === 'state') {
      const state = INDIA_STATES_GEO.find((s) => s.name === decodedId);
      if (!state) return null;
      const stateBeneficiaries = beneficiaries.filter((b) => b.location.state === decodedId);
      const stateTxns = transactions.filter((t) => t.location.state === decodedId);
      return {
        type: 'State',
        name: state.name,
        hierarchy: state.name,
        schemes: ['NSAP Pension', 'PM-Kisan', 'NFSA', 'MGNREGA'],
        riskScore: state.riskIndex,
        riskBreakdown: {
          duplicateIds: Math.round(state.riskIndex * 0.3),
          flaggedTxns: Math.round(state.riskIndex * 0.35),
          regionalAnomalies: Math.round(state.riskIndex * 0.2),
          populationDeviation: Math.round(state.riskIndex * 0.15),
        },
        flags: [
          { date: '2024-10-01', type: 'High anomaly density', severity: 'high' },
          { date: '2024-09-15', type: 'Duplicate cluster', severity: 'medium' },
        ],
        linkedTransactions: stateTxns.slice(0, 8),
        reasonTags: ['High Regional Density', 'Duplicate Bank Account', 'Multiple Scheme Usage'],
        beneficiaryCount: stateBeneficiaries.length,
        flaggedCount: stateTxns.length,
      };
    }
    if (entityType === 'district' || entityType === 'village') {
      const b = beneficiaries.find(
        (x) =>
          (entityType === 'district' && x.location.district === decodedId) ||
          (entityType === 'village' && x.location.village === decodedId)
      );
      const loc = b?.location || { district: decodedId, block: '—', village: '—', state: '—' };
      const ents = beneficiaries.filter(
        (x) =>
          (entityType === 'district' && x.location.district === decodedId) ||
          (entityType === 'village' && x.location.village === decodedId)
      );
      const txns = transactions.filter(
        (t) =>
          (entityType === 'district' && t.location.district === decodedId) ||
          (entityType === 'village' && t.location.village === decodedId)
      );
      const riskScore = Math.round(55 + Math.random() * 25);
      return {
        type: entityType === 'district' ? 'District' : 'Village',
        name: decodedId,
        hierarchy: `${loc.village} → ${loc.block} → ${loc.district} → ${loc.state}`,
        schemes: ['NSAP Pension', 'PM-Kisan', 'NFSA'],
        riskScore,
        riskBreakdown: {
          duplicateIds: Math.round(riskScore * 0.32),
          flaggedTxns: Math.round(riskScore * 0.28),
          regionalAnomalies: Math.round(riskScore * 0.22),
          populationDeviation: Math.round(riskScore * 0.18),
        },
        flags: txns.slice(0, 3).map((t) => ({ date: t.date, type: t.flagReason, severity: t.riskSeverity })),
        linkedTransactions: txns.slice(0, 6),
        reasonTags: ['Duplicate Bank Account', 'Multiple Scheme Usage', 'High Regional Density'],
        beneficiaryCount: ents.length,
        flaggedCount: txns.length,
      };
    }
    return null;
  })();

  if (!entity) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          ← Back
        </button>
        <p className="text-slate-500">Entity not found.</p>
      </div>
    );
  }

  const colors = getRiskColor(entity.riskScore);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          ← Back
        </button>
      </div>

      <header>
        <h1 className="text-2xl font-semibold text-slate-100">{entity.name}</h1>
        <p className="text-slate-400 mt-1">Investigation Profile — {entity.type}</p>
      </header>

      {/* Context */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-medium text-slate-200 mb-4">📍 Context</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Entity type</p>
            <p className="text-slate-200">{entity.type}</p>
          </div>
          <div>
            <p className="text-slate-500">Location hierarchy</p>
            <p className="text-slate-200">{entity.hierarchy}</p>
          </div>
          <div>
            <p className="text-slate-500">Related schemes</p>
            <p className="text-slate-200">{entity.schemes?.join(', ')}</p>
          </div>
          {entity.beneficiaryCount != null && (
            <div>
              <p className="text-slate-500">Beneficiaries</p>
              <p className="text-slate-200">{entity.beneficiaryCount}</p>
            </div>
          )}
        </div>
      </section>

      {/* Risk breakdown */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-medium text-slate-200 mb-4">⚠️ Risk Score Breakdown</h2>
        <div className="flex items-center gap-4 mb-6">
          <span className={`text-3xl font-bold ${colors.text}`}>{entity.riskScore}</span>
          <span className="text-slate-400">Overall risk (0–100)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(entity.riskBreakdown || {}).map(([key, val]) => (
            <div key={key} className="bg-slate-900/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-lg font-semibold text-slate-200">{val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flag history */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-medium text-slate-200 mb-4">🚩 Flag History</h2>
        <div className="space-y-3">
          {(entity.flags || []).map((f, i) => {
            const sev = getSeverityColor(f.severity);
            return (
              <div
                key={i}
                className="flex items-center gap-4 py-2 border-b border-slate-700/50 last:border-0"
              >
                <span className="text-slate-500 text-sm w-24">{f.date}</span>
                <span className="text-slate-300 flex-1">{f.type}</span>
                <span className={`text-xs px-2 py-0.5 rounded capitalize ${sev.bg} ${sev.text}`}>
                  {f.severity}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Linked transactions */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-medium text-slate-200 mb-4">💸 Linked Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-4 text-slate-500">Date</th>
                <th className="text-left py-2 px-4 text-slate-500">Scheme</th>
                <th className="text-left py-2 px-4 text-slate-500">Amount</th>
                <th className="text-left py-2 px-4 text-slate-500">Severity</th>
              </tr>
            </thead>
            <tbody>
              {(entity.linkedTransactions || []).map((t) => {
                const sev = getSeverityColor(t.riskSeverity);
                return (
                  <tr key={t.id} className="border-b border-slate-700/50">
                    <td className="py-2 px-4 text-slate-300">{t.date}</td>
                    <td className="py-2 px-4 text-slate-300">{t.scheme}</td>
                    <td className="py-2 px-4 text-slate-300">₹{t.amount?.toLocaleString()}</td>
                    <td className="py-2 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded capitalize ${sev.bg} ${sev.text}`}>
                        {t.riskSeverity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reason tags */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-medium text-slate-200 mb-4">🏷 Reason Tags</h2>
        <div className="flex flex-wrap gap-2">
          {(entity.reasonTags || []).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
