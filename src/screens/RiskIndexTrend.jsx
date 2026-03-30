import { useApp } from '../context/AppContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
} from 'recharts';

export default function RiskIndexTrend() {
  const { riskTrend } = useApp();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">Risk Index Trend</h1>
        <p className="text-slate-400 mt-1">
          Time-series showing whether leakage risk is increasing or decreasing over time
        </p>
      </header>

      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-medium text-slate-200 mb-4">Monthly Risk Index</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
                formatter={(value, name) => [value, name === 'riskIndex' ? 'Risk Index' : 'Anomaly Rate %']}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="riskIndex"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 0 }}
                name="Risk Index"
              />
              {riskTrend
                .filter((d) => d.events)
                .map((d, i) => (
                  <ReferenceDot
                    key={i}
                    x={d.month}
                    y={d.riskIndex}
                    r={6}
                    fill="#eab308"
                    stroke="#f1f5f9"
                    strokeWidth={1}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Risk Index (0–100)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Audits / Policy changes
          </span>
        </div>
      </div>
    </div>
  );
}
