import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getRiskColor } from '../utils/riskCalculations';

export default function HighRiskBeneficiaries() {
  const navigate = useNavigate();
  const { beneficiaries } = useApp();
  const [sortBy, setSortBy] = useState('riskScore');
  const [filterMinScore, setFilterMinScore] = useState(70);
  const [search, setSearch] = useState('');

  const highRisk = useMemo(() => {
    return beneficiaries.filter((b) => b.riskScore >= filterMinScore);
  }, [beneficiaries, filterMinScore]);

  const filtered = useMemo(() => {
    let list = highRisk;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.location.district.toLowerCase().includes(q) ||
          b.location.state.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => (sortBy === 'riskScore' ? b.riskScore - a.riskScore : a.name.localeCompare(b.name)));
  }, [highRisk, search, sortBy]);

  const handleRowClick = (beneficiary) => {
    navigate(`/profile/beneficiary/${beneficiary.id}`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">High-Risk Beneficiaries</h1>
        <p className="text-slate-400 mt-1">Beneficiaries flagged with multiple risk signals — click to investigate</p>
      </header>

      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={filterMinScore}
          onChange={(e) => setFilterMinScore(Number(e.target.value))}
          className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value={60}>Min Risk 60+</option>
          <option value={70}>Min Risk 70+</option>
          <option value={80}>Min Risk 80+</option>
          <option value={90}>Min Risk 90+</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="riskScore">Sort by Risk Score</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Name</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Age</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Location</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Risk Score</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Risk Factors</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const colors = getRiskColor(b.riskScore);
                return (
                  <tr
                    key={b.id}
                    onClick={() => handleRowClick(b)}
                    className="border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6 text-slate-200">{b.name}</td>
                    <td className="py-4 px-6 text-slate-400">{b.age}</td>
                    <td className="py-4 px-6 text-slate-400">{[b.location.district, b.location.state].join(', ')}</td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${colors.text}`}>{b.riskScore}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {b.riskFactors.map((f) => (
                          <span
                            key={f}
                            className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500">No beneficiaries match the filters.</div>
        )}
      </div>
    </div>
  );
}
