import { useApp } from '../context/AppContext';
import KPICard from '../components/KPICard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getRiskColor } from '../utils/riskCalculations';

export default function Dashboard() {
  const { kpis, regionalAnomalies } = useApp();
  const anomalyColor = getRiskColor(kpis.anomalyRate);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">Main Dashboard</h1>
        <p className="text-slate-400 mt-1">Quick system health overview for welfare disbursement risk</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Beneficiaries"
          value={kpis.totalBeneficiaries}
          subtitle="Across all schemes"
          to="/high-risk-beneficiaries"
          colorScheme={getRiskColor(20)}
        />
        <KPICard
          title="High-Risk Beneficiaries"
          value={kpis.highRiskBeneficiaries}
          subtitle="Score ≥ 70"
          riskScore={kpis.highRiskBeneficiaries > 50 ? 75 : 45}
          to="/high-risk-beneficiaries"
        />
        <KPICard
          title="Flagged Transactions"
          value={kpis.flaggedTransactions}
          subtitle="For review"
          riskScore={kpis.flaggedTransactions > 500 ? 70 : 50}
          to="/flagged-transactions"
        />
        <KPICard
          title="Anomaly Rate"
          value={`${kpis.anomalyRate}%`}
          subtitle="Abnormal records"
          riskScore={kpis.anomalyRate}
          to="/anomaly-analysis"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-4">Regional Anomalies Over Time</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalAnomalies.slice(0, 10)} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="region" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="anomalyCount" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Flagged Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-slate-200">Summary Indicators</h2>
          <div className="space-y-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400">Ghost Beneficiary Suspects</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{kpis.ghostBeneficiaries}</p>
              <p className="text-xs text-slate-500 mt-1">Requires field verification</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400">Duplicate Entries</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{kpis.duplicateEntries}</p>
              <p className="text-xs text-slate-500 mt-1">Multiple IDs or bank accounts</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400">Risk Index Formula</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                30% Anomaly Rate + 30% Flagged Density + 20% High-Risk Count + 20% Population Deviation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
